import dynamic from 'next/dynamic'
import React from 'react'

const features: Record<string, React.ComponentType<any>> = {
  FEATURE12: dynamic(() => import('./feature12')),
  FEATURE19: dynamic(() => import('./feature19')),
  FEATURE51: dynamic(() => import('./feature51')),
  FEATURE52: dynamic(() => import('./feature52')),
  FEATURE54: dynamic(() => import('./feature54')),
  FEATURE57: dynamic(() => import('./feature57')),
  FEATURE70: dynamic(() => import('./feature70')),
  FEATURE78: dynamic(() => import('./feature78')),
  FEATURE95: dynamic(() => import('./feature95')),
  FEATURE105: dynamic(() => import('./feature105')),
  FEATURE106: dynamic(() => import('./feature106')),
  FEATURE108: dynamic(() => import('./feature108')),
  FEATURE114: dynamic(() => import('./feature114')),
  FEATURE126: dynamic(() => import('./feature126')),
  FEATURE250: dynamic(() => import('./feature250')),
}

export const FeatureSpecialBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'feature-special') return null

  const { designVersion } = props || {}
  if (!designVersion) return null

  const F = features[designVersion]
  if (!F) return null

  return <F {...props} />
}
