/* global smplr */
import React, { useRef, useState, useEffect } from 'react'
import { Group, Button } from '@mantine/core'
import chroma from 'chroma-js'
import numeral from 'numeral'
import { evolve, add, map, range } from 'ramda'

import Viewer from './Viewer'
import { desks, rooms, wayfindingPath, wifiPoints, floorplan } from './data'
import { splitPolyline } from './utils'

const SPACE_ID = 'ac662f1b-bd0f-4de2-860f-510fa2f90d86'
const GROUND_SPACE_ID = 'd9a06a4e-10ce-4acc-9ade-01120d02d29a'

const USECASES = [
  'Desk booking',
  'Wayfinding',
  'Occupancy',
  'Device management',
  'Commercial leasing'
]
const DEFAULT_INDEX = 3

const Showreel = () => {
  const spaceRef = useRef()

  const [spaceReady, setSpaceReady] = useState(null)
  const [usecase, setUsecase] = useState(USECASES[DEFAULT_INDEX])

  const renderSpace = ({ spaceId, preview }) => {
    setSpaceReady(null)
    spaceRef.current && spaceRef.current.remove()
    spaceRef.current = new smplr.Space({
      spaceId,
      spaceToken: 'X',
      containerId: 'smplr-container'
    })
    spaceRef.current.startViewer({
      preview,
      onReady: () => setSpaceReady(spaceId),
      onError: error => console.error('Could not start viewer', error)
    })
  }

  useEffect(() => {
    if (!spaceReady) {
      return
    }
    // render another space if required
    if (usecase === 'Commercial leasing' && spaceReady !== GROUND_SPACE_ID) {
      renderSpace({ spaceId: GROUND_SPACE_ID, preview: false })
      return
    }
    if (usecase !== 'Commercial leasing' && spaceReady === GROUND_SPACE_ID) {
      renderSpace({ spaceId: SPACE_ID, preview: false })
      return
    }
    // data layers
    if (usecase === 'Desk booking') {
      spaceRef.current.addDataLayer({
        id: 'desks',
        type: 'furniture',
        data: desks,
        tooltip: d => `${d.name} - ${d.available ? 'free' : 'occupied'}`,
        color: d => (d.available ? '#3aa655' : '#ff3f34')
      })
    }
    if (usecase === 'Wayfinding') {
      spaceRef.current.addDataLayer({
        id: 'directions',
        type: 'point',
        data: splitPolyline({
          polyline: wayfindingPath,
          gap: 0.6
        })
          .map(
            evolve({
              elevation: add(1)
            })
          )
          .map(pt => ({ position: pt })),
        diameter: 0.3,
        color: '#973bed'
      })
    }
    if (usecase === 'Occupancy') {
      spaceRef.current.addDataLayer({
        id: 'rooms',
        type: 'polygon',
        data: rooms,
        tooltip: d => `${d.name} - ${numeral(d.occupancyRate).format('0.0%')}`,
        color: d =>
          chroma
            .scale('Blues')
            .domain([-0.5, 1])(d.occupancyRate)
            .hex(),
        alpha: 0.8,
        height: 2.9
      })
    }
    if (usecase === 'Device management') {
      // spaceRef.current.enablePickingMode({
      //   onPick: console.log
      // })
      spaceRef.current.addDataLayer({
        id: 'wifi-points',
        type: 'point',
        data: wifiPoints,
        diameter: 1,
        tooltip: d => d.name,
        onHover: d => {
          spaceRef.current.addDataLayer({
            id: 'wifi-range',
            type: 'polyline',
            data: [
              {
                coordinates: [
                  { ...d.position, elevation: 0 },
                  { ...d.position, elevation: 5.5 }
                ]
              }
            ],
            scale: d.range,
            alpha: 0.5,
            onHoverOut: () => spaceRef.current.removeDataLayer('wifi-range')
          })
        },
        onHoverOut: () => spaceRef.current.removeDataLayer('wifi-range')
      })
    }
    if (usecase === 'Commercial leasing') {
      const colorScheme = {
        paid: '#3aa655',
        'payment due': '#ff3f34',
        'for rent': '#bec4c8'
      }
      spaceRef.current.addDataLayer({
        id: 'levels',
        type: 'polygon',
        data: map(i => ({
          name: `Level ${i}`,
          coordinates: map(pt => ({
            ...pt,
            levelIndex: i - 1
          }))(floorplan),
          // eslint-disable-next-line standard/computed-property-even-spacing
          status: ['paid', 'payment due', 'for rent'][
            Math.floor(Math.random() * 2.99)
          ]
        }))(range(1, 9)),
        color: d => colorScheme[d.status],
        height: 2.5,
        tooltip: d => `${d.name} - ${d.status}`
      })
    }
    return () => {
      spaceRef.current.removeDataLayer('desks')
      spaceRef.current.removeDataLayer('rooms')
      spaceRef.current.removeDataLayer('directions')
      spaceRef.current.removeDataLayer('wifi-points')
      spaceRef.current.removeDataLayer('wifi-range')
      spaceRef.current.removeDataLayer('levels')
    }
  }, [usecase, spaceReady])

  return (
    <div style={{ width: '100%', maxWidth: '1024px', margin: '0 auto' }}>
      <Group mb='sm'>
        {USECASES.map(uc => (
          <Button
            key={uc}
            variant={usecase === uc ? 'filled' : 'outline'}
            onClick={() => setUsecase(uc)}
          >
            {uc}
          </Button>
        ))}
      </Group>
      <Viewer
        onLoad={() => renderSpace({ spaceId: SPACE_ID, preview: false })}
      />
    </div>
  )
}

export default Showreel
