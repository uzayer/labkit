import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React, { ReactElement } from 'react'

import type { Header } from '@/payload-types'
import { DataFromGlobalSlug } from 'payload'
import Navbar5 from './navbar/navbar5'
import { Navbar1 } from './navbar/navbar1'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Navbar4 } from './navbar/navbar4'

export async function Header({ publicContext }: { publicContext: PublicContextProps }) {
  const header = (await getCachedGlobal(
    'header',
    publicContext.locale,
    1,
  )()) as DataFromGlobalSlug<'header'>

  let navbarComponent: ReactElement
  switch (header.designVersion) {
    case '1': {
      navbarComponent = <Navbar1 header={header} publicContext={publicContext} />
      break
    }
    case '4': {
      navbarComponent = <Navbar4 header={header} publicContext={publicContext} />
      break
    }
    case '5': {
      navbarComponent = <Navbar5 header={header} publicContext={publicContext} />
      break
    }
  }

  return (
    <>
      {navbarComponent}
      <HeaderClient />
    </>
  )
}
