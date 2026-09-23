import { RosetteMark, TickMark } from '@/components/dial/marks'
import { label as labelClass } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

export interface VenueLedgerEntry {
  /** The acronym the field knows the venue by: CHI, TOCHI, ICTD. */
  shortName: string
  /** The venue written out, small under the acronym. */
  name?: string | null
  type?: 'conference' | 'journal' | 'workshop' | 'book-series' | 'other' | null
  publicationCount: number
  /** e.g. "2014–2026", or one year. */
  years?: string | null
  /** Award names the Lab won for papers published here. */
  awards?: string[]
}

const TYPE_LABELS: Record<NonNullable<VenueLedgerEntry['type']>, string> = {
  conference: 'Conference',
  journal: 'Journal',
  workshop: 'Workshop',
  'book-series': 'Book series',
  other: 'Venue',
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * Where the Lab publishes, as a ruled sheet of stamps rather than a line of
 * small type.
 *
 * To a reader inside the field, "CHI" and "TOCHI" are the strongest claim a
 * lab page can make, and they were set at the size of a footnote. Here each
 * venue gets a cell: the acronym at display size, what it stands for under it
 * (most visitors are not in the field), and the Lab's record there in mono —
 * how many papers, over which years. A venue where DIAL won an award wears the
 * rosette and the award's name, which is the one thing more prestigious than
 * being published there.
 *
 * Hairlines come from the grid's gap, as in ThemeSpotlight, so no cell doubles
 * its neighbour's rule. Two columns on a phone, three from `md`; on a phone
 * the acronym steps down so an eight-letter one (COMSNETS) stays in its cell.
 */
export function VenueLedger({
  venues,
  label = 'Published at',
  className,
}: {
  venues: VenueLedgerEntry[]
  label?: string
  className?: string
}) {
  if (venues.length === 0) return null
  return (
    <div data-reveal className={className}>
      <p className={cn(labelClass, 'reveal-item mb-4 flex items-center gap-2')}>
        <TickMark />
        {label}
      </p>
      <ol className="reveal-item grid grid-cols-2 gap-px border-y border-border bg-border md:grid-cols-3">
        {venues.map((venue) => {
          const awarded = (venue.awards?.length ?? 0) > 0
          return (
            <li
              key={venue.shortName}
              className="flex min-w-0 flex-col gap-3 bg-background px-3 py-5 [overflow-wrap:anywhere] sm:px-6"
            >
              <div className="flex h-5 items-center justify-between gap-2">
                <span className="text-ink font-mono text-[10px] tracking-[0.18em] uppercase">
                  {venue.type ? TYPE_LABELS[venue.type] : 'Venue'}
                </span>
                {awarded && <RosetteMark className="size-5 shrink-0" />}
              </div>
              <div>
                <p className="font-display text-[1.35rem] leading-none tracking-tight sm:text-3xl md:text-4xl">
                  {venue.shortName}
                </p>
                {venue.name && venue.name !== venue.shortName && (
                  <p className="mt-2 line-clamp-2 text-xs text-pretty text-muted-foreground">
                    {venue.name}
                  </p>
                )}
              </div>
              <div className="mt-auto flex flex-col gap-1">
                <p className="font-mono text-xs text-muted-foreground tabular-nums">
                  {plural(venue.publicationCount, 'paper')}
                  {venue.years && <> · {venue.years}</>}
                </p>
                {awarded && (
                  <p className="text-ink text-xs text-pretty">{venue.awards!.join(', ')}</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
