import React, { useState, useCallback, useEffect } from 'react'
import chroma from 'chroma-js'
import { Group, Button } from '@mantine/core'
import {
  compose,
  groupBy,
  mapObjIndexed,
  pluck,
  prop,
  sum,
  values
} from 'ramda'
import numeral from 'numeral'

import Viewer from './Viewer'
import data from './data.json'

const colorScale = chroma.scale('Spectral')
const randomColor = () => colorScale(Math.random()).hex()
const addRandomColor = e => ({
  ...e,
  color: randomColor()
})

const addCoordinates = ({ padding = 0 } = {}) => e => ({
  ...e,
  coordinates: [
    {
      levelIndex: 0,
      x: e.sx - padding,
      z: e.sz - padding
    },
    {
      levelIndex: 0,
      x: e.sx + e.sw + padding,
      z: e.sz - padding
    },
    {
      levelIndex: 0,
      x: e.sx + e.sw + padding,
      z: e.sz + e.sd + padding
    },
    {
      levelIndex: 0,
      x: e.sx - padding,
      z: e.sz + e.sd + padding
    }
  ]
})

const items = data.items.map(addCoordinates()).map(addRandomColor)

const occupancyPercent = compose(
  values,
  mapObjIndexed((items, bin) => {
    const percentUtilised = compose(
      vol => vol / Math.pow(150, 3),
      sum,
      pluck('vol')
    )(items)
    const { sx, sy, sz } = items[0]
    const side = 1.5 - 0.04
    const padding = 0
    const coordinates = [
      {
        levelIndex: 0,
        x: sx - padding,
        z: sz - padding
      },
      {
        levelIndex: 0,
        x: sx + side + padding,
        z: sz - padding
      },
      {
        levelIndex: 0,
        x: sx + side + padding,
        z: sz + side + padding
      },
      {
        levelIndex: 0,
        x: sx - padding,
        z: sz + side + padding
      }
    ]
    return { bin, percentUtilised, sy, coordinates }
  }),
  groupBy(prop('bin'))
)(data.items)

const RoomAvailability = () => {
  const [space, setSpace] = useState()
  const [view, setView] = useState('items')

  // memoize so Viewer render once only (wrapped in memo)
  const onReady = useCallback(space => setSpace(space), [])

  useEffect(() => {
    if (!space) {
      return
    }
    if (view === 'items') {
      space.addDataLayer({
        id: 'items',
        type: 'polygon',
        data: items,
        baseHeight: d => d.sy,
        height: d => d.sh,
        tooltip: d => `Bin: ${d.bin} - Item: ${d.item}`,
        color: d => d.color
      })
      return () => {
        space.removeDataLayer('items')
      }
    }
    if (view === 'occupancy') {
      space.addDataLayer({
        id: 'occupancy',
        type: 'polygon',
        data: occupancyPercent,
        baseHeight: d => d.sy,
        height: d => d.percentUtilised * (1.5 - 0.04),
        tooltip: d =>
          `Bin: ${d.bin} - ${numeral(d.percentUtilised).format(
            '0.00%'
          )} utilised`,
        color: '#3aa655'
      })
      return () => {
        space.removeDataLayer('occupancy')
      }
    }
  }, [space, view])

  return (
    <div style={{ width: '100%', maxWidth: '1024px', margin: '0 auto' }}>
      <Group mb='sm'>
        <Button
          variant='outline'
          disabled={view === 'items'}
          onClick={() => setView('items')}
        >
          View items
        </Button>
        <Button
          variant='outline'
          disabled={view === 'occupancy'}
          onClick={() => setView('occupancy')}
        >
          View bin occupancy
        </Button>
      </Group>
      <Viewer onReady={onReady} />
    </div>
  )
}

export default RoomAvailability
