import dynamic from 'next/dynamic'
import React from 'react'

const features: Record<string, React.ComponentType<any>> = {
  FEATURE1: dynamic(() => import('./feature1')),
  FEATURE50: dynamic(() => import('./feature50')),
  FEATURE53: dynamic(() => import('./feature53')),
  FEATURE72: dynamic(() => import('./feature72')),
  FEATURE81: dynamic(() => import('./feature81')),
  FEATURE90: dynamic(() => import('./feature90')),
  FEATURE102: dynamic(() => import('./feature102')),
  FEATURE117: dynamic(() => import('./feature117')),
}

export const FeatureMediaBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'feature-media') return null

  const { designVersion } = props || {}
  if (!designVersion) return null

  const F = features[designVersion]
  if (!F) return null

  return <F {...props} />
}
