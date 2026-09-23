import Link from 'next/link'

import { RosetteMark } from '@/components/dial/marks'
import { cn } from '@/lib/utils'

/**
 * An Award as a person's page lists it: what it was, who gave it, when, and for
 * which paper — each in its own place, so a column of them can be read down
 * any one of those four.
 */
export interface AwardListItem {
  /** "Best Paper Award", without the paper's title. */
  name: string
  /** The awarding venue or body as recorded, year included or not. */
  organization?: string | null
  year: number
  category?: string | null
  /** The paper it was given for, when the award names one. */
  paper?: { title: string; href?: string | null } | null
}

/**
 * The awarding body without the award's own year, and with a parenthetical
 * expansion split off. The records spell organizations as the source did —
 * "ACM COMPASS 2023 (ACM Journal on Computing and Sustainable Societies)",
 * "ACM CHI 2019" — so printing them beside the year gave "ACM CHI 2019 2019",
 * and the expansion ran the caption onto a second line. The short form is the
 * caption; the long form stays on it as an `abbr` title.
 */
function splitOrganization(organization: string, year: number) {
  const [short, full] = organization.split(/\s*\((.+)\)\s*$/)
  return {
    short: short.replace(new RegExp(`\\s*\\b${year}\\b`), '').trim() || short.trim(),
    full: full ?? null,
  }
}

/**
 * Awards as a ruled list rather than a run of sentences: a rosette stamped in
 * the margin of each row, the award's name in the display serif, the awarding
 * body lettered small in the ink under it, the year in its own column at the
 * right edge, and the paper — the longest and least scannable part — set last
 * and muted, so it never pushes the name out of the reader's line.
 */
export function AwardList({ awards, className }: { awards: AwardListItem[]; className?: string }) {
  if (awards.length === 0) return null
  return (
    <ol className={cn('divide-y divide-border border-y border-border', className)}>
      {awards.map((award) => {
        const org = award.organization ? splitOrganization(award.organization, award.year) : null
        return (
          <li
            key={`${award.name}-${award.year}-${award.paper?.title ?? org?.short ?? ''}`}
            className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-x-4 py-4"
          >
            <span
              aria-hidden
              className="border-ink/35 bg-ink/8 mt-0.5 grid size-9 place-items-center rounded-full border"
            >
              <RosetteMark className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg leading-snug">{award.name}</p>
              {org && (
                <p className="text-ink mt-1 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
                  {org.full ? (
                    <abbr title={org.full} className="no-underline">
                      {org.short}
                    </abbr>
                  ) : (
                    org.short
                  )}
                </p>
              )}
              {award.paper && (
                <p className="mt-1.5 line-clamp-2 text-sm text-pretty text-muted-foreground">
                  {award.paper.href ? (
                    <Link
                      href={award.paper.href}
                      className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current"
                    >
                      {award.paper.title}
                    </Link>
                  ) : (
                    award.paper.title
                  )}
                </p>
              )}
            </div>
            <span className="pt-1 font-mono text-xs text-muted-foreground tabular-nums">
              {award.year}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
