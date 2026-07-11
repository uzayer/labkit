import React from 'react'
import type { AwardsBlock as AwardsBlockProps } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

const Awards2: React.FC<
  AwardsBlockProps & { publicContext: PublicContextProps; disableContainer?: boolean }
> = (props) => {
  const { sectionLabel, accentColor, awards, disableContainer } = props

  const sectionLabelText = typeof sectionLabel === 'string' ? sectionLabel : 'AWARDS'

  // Map accent color to Tailwind class (enumeration needed for Tailwind to include the class)
  let accentColorClass = 'bg-orange-500'
  switch (accentColor) {
    case 'orange-500':
      accentColorClass = 'bg-orange-500'
      break
    case 'blue-500':
      accentColorClass = 'bg-blue-500'
      break
    case 'green-500':
      accentColorClass = 'bg-green-500'
      break
    case 'red-500':
      accentColorClass = 'bg-red-500'
      break
    case 'purple-500':
      accentColorClass = 'bg-purple-500'
      break
    case 'pink-500':
      accentColorClass = 'bg-pink-500'
      break
    case 'yellow-500':
      accentColorClass = 'bg-yellow-500'
      break
    case 'indigo-500':
      accentColorClass = 'bg-indigo-500'
      break
    case 'teal-500':
      accentColorClass = 'bg-teal-500'
      break
    case 'cyan-500':
      accentColorClass = 'bg-cyan-500'
      break
    default:
      accentColorClass = 'bg-orange-500'
  }

  return (
    <section className="py-32">
      <div className={!disableContainer ? 'container' : ''}>
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-6">
          <div className="top-10 col-span-2 flex h-fit w-fit items-center gap-3 py-8 lg:sticky">
            <span className={`size-3 ${accentColorClass}`} />
            <p className="text-2xl text-foreground/30 uppercase">{sectionLabelText}</p>
          </div>
          <ul className="col-span-4 w-full">
            {awards &&
              awards.map((award, index) => {
                const awardTitle = typeof award.title === 'string' ? award.title : ''
                const awardYear = typeof award.year === 'string' ? award.year : ''
                const awardDescription =
                  award.description && typeof award.description === 'string'
                    ? award.description
                    : null

                return (
                  <li key={award.id || index} className="border-b py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-medium tracking-tight">{awardTitle}</h3>
                        {awardDescription && (
                          <p className="mt-2 text-sm text-foreground/70">{awardDescription}</p>
                        )}
                      </div>
                      <p className="ml-4 flex-shrink-0 font-mono text-lg tracking-tighter text-foreground/50">
                        {awardYear}
                      </p>
                    </div>
                  </li>
                )
              })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Awards2
