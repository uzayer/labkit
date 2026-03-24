'use client'

import { FeaturedBanner } from './FeaturedBanner'
import { FeaturedImage } from './FeaturedImage'
import { CategoryGrid } from './CategoryGrid'
import { CardGrid } from './CardGrid'
import { FeatureList } from './FeatureList'
import { SimpleLinks } from './SimpleLinks'
import { PublicContextProps } from '@/utilities/publicContextProps'

export type NavSubmenuBlock = {
  id?: string | null
  blockType: string
  [key: string]: any
}

export type BlockRendererProps = {
  blocks?: NavSubmenuBlock[]
  publicContext: PublicContextProps
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks = [], publicContext }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  console.log(
    'block type',
    blocks.map((block) => block.blockType),
  )

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'featuredImage':
            return (
              <FeaturedImage
                key={block.id || `featured-image-${index}`}
                title={block.title}
                subtitle={block.subtitle}
                description={block.description}
                image={block.image}
                backgroundColor={block.backgroundColor}
                link={block.link}
                publicContext={publicContext}
              />
            )
          case 'featuredBanner':
            return (
              <FeaturedBanner
                key={block.id || `featured-banner-${index}`}
                title={block.title}
                subtitle={block.subtitle}
                description={block.description}
                image={block.image}
                backgroundColor={block.backgroundColor}
                link={block.link}
                publicContext={publicContext}
              />
            )
          case 'categoryGrid':
            return (
              <CategoryGrid
                key={block.id || `category-grid-${index}`}
                title={block.title}
                items={block.items}
                publicContext={publicContext}
              />
            )
          case 'cardGrid':
            return (
              <CardGrid
                key={block.id || `card-grid-${index}`}
                title={block.title}
                cards={block.cards}
                publicContext={publicContext}
              />
            )
          case 'featureList':
            return (
              <FeatureList
                key={block.id || `feature-list-${index}`}
                title={block.title}
                features={block.features}
                publicContext={publicContext}
              />
            )
          case 'simpleLinks':
            return (
              <SimpleLinks
                key={block.id || `simple-links-${index}`}
                title={block.title}
                links={block.links}
                publicContext={publicContext}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}
