import React, { memo } from 'react'
import PropTypes from 'prop-types'

import useSmplrJs from '../../hooks/useSmplrJs'

const Viewer = memo(({ onLoad }) => {
  useSmplrJs({ onLoad })

  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%'
      }}
    >
      <div
        id='smplr-container'
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'whitesmoke'
        }}
      />
    </div>
  )
})

Viewer.propTypes = {
  onLoad: PropTypes.func.isRequired
}

export default Viewer
