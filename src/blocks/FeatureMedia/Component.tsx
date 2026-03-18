import dynamic from 'next/dynamic'
import React from 'react'

const features: Record<string, React.ComponentType<any>> = {
  FEATURE50: dynamic(() => import('@/blocks/Feature/feature50')),
  FEATURE53: dynamic(() => import('@/blocks/Feature/feature53')),
  FEATURE57: dynamic(() => import('@/blocks/Feature/feature57')),
  FEATURE70: dynamic(() => import('@/blocks/Feature/feature70')),
  FEATURE72: dynamic(() => import('@/blocks/Feature/feature72')),
  FEATURE102: dynamic(() => import('@/blocks/Feature/feature102')),
  FEATURE105: dynamic(() => import('@/blocks/Feature/feature105')),
  FEATURE117: dynamic(() => import('@/blocks/Feature/feature117')),
  FEATURE126: dynamic(() => import('@/blocks/Feature/feature126')),
}

export const FeatureMediaBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'feature-media') return null

  const { designVersion } = props || {}
  if (!designVersion) return null

  const F = features[designVersion]
  if (!F) return null

  return <F {...props} />
}
