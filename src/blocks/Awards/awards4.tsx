import React from 'react'
import type { AwardsBlock as AwardsBlockProps } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'
// import { Media } from '@/components/Media'

const Awards4: React.FC<
  AwardsBlockProps & { publicContext: PublicContextProps; disableContainer?: boolean }
> = (props) => {
  const {
    headline,
    dateRange,
    nameColumnHeader,
    nominationColumnHeader,
    yearColumnHeader,
    awards,
    disableContainer,
    publicContext,
  } = props

  const nameHeader = typeof nameColumnHeader === 'string' ? nameColumnHeader : 'Name'
  const nominationHeader =
    typeof nominationColumnHeader === 'string' ? nominationColumnHeader : 'Nomination'
  const yearHeader = typeof yearColumnHeader === 'string' ? yearColumnHeader : 'Year'
  const dateRangeText = typeof dateRange === 'string' ? dateRange : '(2015-25©)'

  // Format index number with leading zeros (001, 002, etc.)
  const formatIndex = (index: number, total: number): string => {
    const num = index + 1
    const digits = total.toString().length
    const padded = num.toString().padStart(digits, '0')
    return `(${padded})`
  }

  return (
    <section className="py-32">
      <div
        className={
          !disableContainer ? 'container space-y-10 lg:space-y-20' : 'space-y-10 lg:space-y-20'
        }
      >
        <div className="flex w-full items-end justify-between">
          {headline && (
            <RichText
              publicContext={publicContext}
              content={headline}
              withWrapper={false}
              overrideStyle={{
                h1: 'text-5xl font-semibold tracking-tighter lg:text-8xl',
                h2: 'text-5xl font-semibold tracking-tighter lg:text-8xl',
                h3: 'text-5xl font-semibold tracking-tighter lg:text-8xl',
                h4: 'text-5xl font-semibold tracking-tighter lg:text-8xl',
                p: 'text-5xl font-semibold tracking-tighter lg:text-8xl',
              }}
            />
          )}
          {dateRangeText && (
            <h2 className="text-lg font-semibold tracking-tighter lg:text-3xl">{dateRangeText}</h2>
          )}
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="h-12 border-b text-left text-foreground/40">
              <th className="hidden min-w-30 font-normal lg:table-cell lg:min-w-40"></th>
              <th className="font-normal">{nameHeader}</th>
              <th className="hidden font-normal md:table-cell">{nominationHeader}</th>
              <th className="text-left text-right font-normal">{yearHeader}</th>
            </tr>
          </thead>
          <tbody>
            {awards &&
              awards.map((award, index) => {
                const awardTitle = typeof award.title === 'string' ? award.title : ''
                const awardYear = typeof award.year === 'string' ? award.year : ''
                const awardDescription =
                  award.description && typeof award.description === 'string'
                    ? award.description
                    : null

                // Get logo URL
                const logoUrl =
                  award.logo &&
                  typeof award.logo === 'object' &&
                  award.logo !== null &&
                  'url' in award.logo
                    ? typeof award.logo.url === 'string'
                      ? award.logo.url
                      : null
                    : null

                const indexNumber = formatIndex(index, awards.length)

                return (
                  <tr
                    key={award.id || index}
                    className="h-20 border-b text-left text-foreground/40"
                  >
                    <td className="hidden font-medium tracking-tight text-foreground/50 lg:table-cell">
                      {indexNumber}
                    </td>
                    <td className="text-lg font-medium tracking-tight text-foreground lg:text-xl">
                      <div className="flex items-center gap-2">
                        {logoUrl && (
                          <span className="flex size-8 items-center justify-center rounded-xl bg-foreground object-cover p-1.5">
                            <img src={logoUrl} className="invert" alt={awardTitle || ''} />
                          </span>
                        )}
                        {awardTitle}
                      </div>
                    </td>
                    <td className="hidden md:table-cell">{awardDescription}</td>
                    <td className="text-right text-foreground">{awardYear}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Awards4
