import dynamic from 'next/dynamic'
import React from 'react'

const features: Record<string, React.ComponentType<any>> = {
  FEATURE19: dynamic(() => import('@/blocks/Feature/feature19')),
  FEATURE114: dynamic(() => import('@/blocks/Feature/feature114')),
  FEATURE250: dynamic(() => import('@/blocks/Feature/feature250')),
}

export const FeatureSpecialBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'feature-special') return null

  const { designVersion } = props || {}
  if (!designVersion) return null

  const F = features[designVersion]
  if (!F) return null

  return <F {...props} />
}
