import dynamic from 'next/dynamic'
import React from 'react'

const features: Record<string, React.ComponentType<any>> = {
  FEATURE25: dynamic(() => import('./feature25')),
  FEATURE68: dynamic(() => import('./feature68')),
  FEATURE91: dynamic(() => import('./feature91')),
  FEATURE97: dynamic(() => import('./feature97')),
  FEATURE99: dynamic(() => import('./feature99')),
  FEATURE103: dynamic(() => import('./feature103')),
  FEATURE159: dynamic(() => import('./feature159')),
}

export const FeatureListBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'feature-list') return null

  const { designVersion } = props || {}
  if (!designVersion) return null

  const F = features[designVersion]
  if (!F) return null

  return <F {...props} />
}
