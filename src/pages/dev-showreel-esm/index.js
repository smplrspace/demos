/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'

import Page from '../../components/Page'
import Showreel from './Showreel'

export default function () {
  return (
    <Page title='[DEV ESM] Showreel'>
      <h1>[DEV ESM] Showreel of use-cases</h1>
      <Showreel />
    </Page>
  )
}
