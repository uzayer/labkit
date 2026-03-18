import dynamic from 'next/dynamic'
import React from 'react'

const features: Record<string, React.ComponentType<any>> = {
  FEATURE1: dynamic(() => import('@/blocks/Feature/feature1')),
}

export const FeatureHeroBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'feature-hero') return null

  const { designVersion } = props || {}
  if (!designVersion) return null

  const F = features[designVersion]
  if (!F) return null

  return <F {...props} />
}
