import React from 'react'
import { MoveUpRight } from 'lucide-react'
import type { AwardsBlock as AwardsBlockProps } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'

const Awards3: React.FC<
  AwardsBlockProps & { publicContext: PublicContextProps; disableContainer?: boolean }
> = (props) => {
  const { headline, description, awards, disableContainer, publicContext } = props

  // Map color to Tailwind class (enumeration needed for Tailwind to include the class)
  const getColorClass = (color: string | undefined | null): string => {
    if (!color) return 'bg-amber-300'
    switch (color) {
      case 'amber-300':
        return 'bg-amber-300'
      case 'red-500':
        return 'bg-red-500'
      case 'blue-500':
        return 'bg-blue-500'
      case 'green-500':
        return 'bg-green-500'
      case 'purple-500':
        return 'bg-purple-500'
      case 'pink-500':
        return 'bg-pink-500'
      case 'yellow-500':
        return 'bg-yellow-500'
      case 'orange-500':
        return 'bg-orange-500'
      case 'indigo-500':
        return 'bg-indigo-500'
      case 'teal-500':
        return 'bg-teal-500'
      case 'cyan-500':
        return 'bg-cyan-500'
      default:
        return 'bg-amber-300'
    }
  }

  return (
    <section className="py-32">
      <div className={!disableContainer ? 'container' : ''}>
        {headline && (
          <div className="mb-6">
            <RichText publicContext={publicContext} content={headline} withWrapper={false} />
          </div>
        )}
        {description && (
          <p className="mb-6 max-w-3xl text-base text-muted-foreground">
            {typeof description === 'string' ? description : ''}
          </p>
        )}

        {awards &&
          awards.map((award, index) => {
            const awardTitle = typeof award.title === 'string' ? award.title : ''
            const awardYear = typeof award.year === 'string' ? award.year : ''
            const awardColor = getColorClass(award.color)
            const awardCategories =
              award.categories && Array.isArray(award.categories)
                ? award.categories.map((cat) =>
                    typeof cat === 'object' && cat !== null && 'category' in cat
                      ? typeof cat.category === 'string'
                        ? cat.category
                        : ''
                      : '',
                  )
                : []

            return (
              <div
                key={award.id || index}
                className="group relative flex items-start gap-4 overflow-hidden border-b border-border p-4"
              >
                <div className="absolute inset-0 z-0 translate-y-full bg-accent transition-transform duration-300 ease-in-out group-hover:translate-y-0" />

                <div className="relative z-10 flex-1 space-y-2 pb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-5 w-5 rounded-md ${awardColor} flex items-center justify-center`}
                    />
                    <h3 className="rounded-md font-medium">{awardTitle}</h3>
                  </div>
                  {awardCategories.length > 0 && (
                    <p className="flex gap-x-2 pl-9 text-sm text-muted-foreground">
                      {awardCategories.map((category, catIndex) => (
                        <span key={catIndex}>{category}</span>
                      ))}
                    </p>
                  )}
                  <p className="pl-9 text-sm text-muted-foreground">{awardYear}</p>
                </div>

                <MoveUpRight className="relative z-10 mt-1 h-4 w-4 text-muted-foreground" />
              </div>
            )
          })}
      </div>
    </section>
  )
}

export default Awards3
