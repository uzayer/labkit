import dynamic from 'next/dynamic'
import React from 'react'

const features: Record<string, React.ComponentType<any>> = {
  FEATUREHERO1: dynamic(() => import('./featurehero1')),
}

export const FeatureHeroBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'feature-hero') return null

  const { designVersion } = props || {}
  if (!designVersion) return null

  const F = features[designVersion]
  if (!F) return null

  return <F {...props} />
}
