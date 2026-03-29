import React from 'react'

import type { TrustStripBlock } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

import { TrustStrip1 } from './trust-strip1'
import { TrustStrip2 } from './trust-strip2'
import { TrustStrip3 } from './trust-strip3'
import { TrustStrip4 } from './trust-strip4'
import type { TrustStripDesignVersion } from './config'

const trustStripComponents: Record<
  TrustStripDesignVersion,
  React.FC<TrustStripBlock & { publicContext: PublicContextProps }>
> = {
  TRUSTSTRIP1: TrustStrip1,
  TRUSTSTRIP2: TrustStrip2,
  TRUSTSTRIP3: TrustStrip3,
  TRUSTSTRIP4: TrustStrip4,
}

export const TrustStripBlockComponent: React.FC<
  TrustStripBlock & { publicContext: PublicContextProps }
> = (props) => {
  const { designVersion = 'TRUSTSTRIP1' } = props
  const Component = trustStripComponents[designVersion as TrustStripDesignVersion]

  if (!Component) {
    console.warn(`Unknown TrustStrip design version: ${designVersion}`)
    return null
  }

  return <Component {...props} />
}
