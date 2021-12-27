/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'

import Page from '../../components/Page'
import Warehouse from './Warehouse'

export default function () {
  return (
    <Page title='Cosmiqo'>
      <h1>Cosmiqo - Warehouse</h1>
      <Warehouse />
    </Page>
  )
}
