import dynamic from 'next/dynamic'
import React from 'react'

const features: Record<string, React.ComponentType<any>> = {
  FEATURE25: dynamic(() => import('@/blocks/Feature/feature25')),
  FEATURE91: dynamic(() => import('@/blocks/Feature/feature91')),
  FEATURE97: dynamic(() => import('@/blocks/Feature/feature97')),
  FEATURE99: dynamic(() => import('@/blocks/Feature/feature99')),
  FEATURE103: dynamic(() => import('@/blocks/Feature/feature103')),
  FEATURE159: dynamic(() => import('@/blocks/Feature/feature159')),
}

export const FeatureListBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'feature-list') return null

  const { designVersion } = props || {}
  if (!designVersion) return null

  const F = features[designVersion]
  if (!F) return null

  return <F {...props} />
}
