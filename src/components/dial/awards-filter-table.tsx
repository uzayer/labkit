'use client'

import { useState } from 'react'
import { AwardStamp } from '@/components/dial/award-stamp'
import { sectionSpacing } from '@/components/dial/editorial'
import { SegmentedControl } from '@/components/dial/segmented-control'
import { listEnter, listStagger } from '@/lib/dial/motion'
import { displaySectionTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

export type AwardCategory =
  | 'best-paper'
  | 'best-poster'
  | 'honorable-mention'
  | 'impact'
  | 'research-grant'
  | 'fellowship'
  | 'recognition'
  | 'competition'
  | 'scholarship'
  | 'other'

export interface Award {
  title: string
  year: number
  category: AwardCategory
  organization: string
  linkedPublication?: string
  recipients: string[]
  externalRecipients?: string
  isFeatured?: boolean
}

export const categoryLabels: Record<AwardCategory, string> = {
  'best-paper': 'Best Paper',
  'best-poster': 'Best Poster',
  'honorable-mention': 'Honorable Mention',
  impact: 'Impact Award',
  'research-grant': 'Research Grant',
  fellowship: 'Fellowship',
  recognition: 'Recognition',
  competition: 'Competition',
  scholarship: 'Scholarship',
  other: 'Other',
}

interface AwardsFilterTableProps {
  awards: Award[]
  yearRange: string
}

export function AwardsFilterTable({ awards, yearRange }: AwardsFilterTableProps) {
  const [activeCategory, setActiveCategory] = useState<AwardCategory | null>(null)

  const uniqueCategories = [...new Set(awards.map((a) => a.category))] as AwardCategory[]

  const filtered = activeCategory ? awards.filter((a) => a.category === activeCategory) : awards

  const byYear = filtered.reduce<Record<string, Award[]>>((acc, award) => {
    const y = award.year.toString()
    ;(acc[y] ??= []).push(award)
    return acc
  }, {})

  const sortedYears = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  return (
    <section className={sectionSpacing}>
      <div className="container space-y-8">
        <div className="flex w-full items-baseline justify-between gap-4 border-t border-border pt-6">
          <h2 className={displaySectionTitle}>Every award</h2>
          <p className="text-sm text-muted-foreground tabular-nums">{yearRange}</p>
        </div>

        <SegmentedControl
          label="Filter by category"
          options={[
            { value: 'all', label: 'All' },
            ...uniqueCategories.map((cat) => ({ value: cat, label: categoryLabels[cat] })),
          ]}
          value={activeCategory ?? 'all'}
          onChange={(value) => setActiveCategory(value === 'all' ? null : (value as AwardCategory))}
        />

        <table className="w-full border-collapse">
          <thead>
            <tr className="h-10 border-b text-left text-sm text-muted-foreground">
              <th className="hidden min-w-28 pr-4 font-normal lg:table-cell">Organization</th>
              <th className="pr-4 font-normal">Award</th>
              <th className="hidden pr-4 font-normal md:table-cell">Publication</th>
              <th className="hidden text-right font-normal lg:table-cell">Category</th>
            </tr>
          </thead>
          {sortedYears.map((year) => (
            <tbody key={year}>
              <tr>
                <td
                  colSpan={4}
                  className="border-b pt-8 pb-2 font-mono text-xs text-muted-foreground tabular-nums"
                >
                  {year}
                </td>
              </tr>
              {byYear[year].map((award, i) => (
                <tr
                  key={`${award.title}-${award.organization}`}
                  className={cn('border-b', listEnter)}
                  style={listStagger(i)}
                >
                  {/* The awarding body is a stamp line in every layout — its own
                      column from lg, the kicker above the award below it —
                      never another grey caption next to the paper's title. */}
                  <td className="hidden py-5 pr-6 align-top lg:table-cell">
                    <AwardStamp organization={award.organization} className="pt-1.5" />
                  </td>
                  <td className="font-display py-5 pr-6 align-top text-lg leading-snug text-foreground lg:text-xl">
                    <AwardStamp
                      organization={award.organization}
                      category={categoryLabels[award.category]}
                      className="mb-2 lg:hidden"
                    />
                    {award.title}
                    {award.linkedPublication && (
                      <span className="mt-2 block font-sans text-sm text-pretty text-muted-foreground md:hidden">
                        &ldquo;{award.linkedPublication}&rdquo;
                      </span>
                    )}
                  </td>
                  <td className="hidden py-5 pr-6 align-top text-sm text-pretty text-muted-foreground md:table-cell">
                    {award.linkedPublication ? `"${award.linkedPublication}"` : '—'}
                  </td>
                  <td className="hidden py-5 text-right align-top text-sm whitespace-nowrap text-muted-foreground lg:table-cell">
                    {categoryLabels[award.category]}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </section>
  )
}
