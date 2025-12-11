import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import { PublicContextProps } from '@/utilities/publicContextProps'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: any
}

export const RelatedPosts: React.FC<RelatedPostsProps & { publicContext: PublicContextProps }> = (
  props,
) => {
  const { className, docs, introContent, publicContext } = props

  return (
    <div className={clsx('container', className)}>
      {introContent && (
        <RichText publicContext={publicContext} content={introContent} enableGutter={false} />
      )}

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}
