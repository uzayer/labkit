import type { Metadata } from 'next'
import Link from 'next/link'

import { CropMarks, PencilArrow, SquiggleText, Tape } from '@/components/dial/marks'
import { enterStep } from '@/lib/dial/motion'
import { label, lede } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Page not found',
  description: "This page is not in DIAL's notebook. The research, publications and people are.",
}

const WAYS_BACK = [
  { href: '/research', title: 'Research', note: 'Nine themes and the projects under them' },
  { href: '/publications', title: 'Publications', note: 'Every paper, with filters' },
  { href: '/people', title: 'People', note: 'The lab, its alumni, and how to join' },
  { href: '/', title: 'Home', note: 'Start from the front page' },
]

/**
 * The 404, as a misprint.
 *
 * A riso press prints each ink in its own pass, and when a sheet slips between
 * passes the second ink lands beside the first rather than on it. That is the
 * page: "404" printed twice, the blue pass drifting out of register once the
 * sheet is down — the one delight on the site that a visitor only meets by
 * accident, so it can afford a slower beat. Reduced motion prints it already
 * slipped, with no travel.
 *
 * The way out is the page's real content: a ruled contents list of the
 * sections a visitor most likely came for, each a full-width row so it is an
 * easy target on a phone.
 */
export default function NotFound() {
  return (
    <section className="relative isolate container pt-16 pb-24 md:pt-28 md:pb-32">
      <CropMarks className="ink-mark-soft top-8 md:top-14" />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <div>
          <p className={cn(label, 'enter')} style={enterStep(0)}>
            Misprint · Error 404
          </p>

          {/* Two passes of the same numerals. The first, in the second ink,
              sits where it should; the blue pass is laid over it in multiply
              and slides off register. Decorative: the heading below says it. */}
          <div
            aria-hidden
            className="enter font-display relative mt-6 w-fit text-[8.5rem] leading-[0.8] tracking-tight select-none sm:text-[12rem] lg:text-[15rem]"
            style={enterStep(1)}
          >
            <span className="text-ink/85 relative">404</span>
            <span
              className={cn(
                'text-ink-blue/70 absolute inset-0 mix-blend-multiply dark:mix-blend-screen',
                'ease-in-out-strong translate-x-[0.045em] translate-y-[0.03em] transition-transform delay-500 duration-[1200ms]',
                'motion-reduce:transition-none starting:translate-0',
              )}
            >
              404
            </span>
          </div>

          <h1
            className="enter font-display mt-10 max-w-2xl text-4xl leading-tight text-balance md:text-5xl"
            style={enterStep(2)}
          >
            This page never made it to press.
          </h1>
          <p className={cn(lede, 'enter mt-5')} style={enterStep(3)}>
            The link may be old, or the address mistyped. Everything the lab has printed is still
            here — start from one of these.
          </p>

          <ul
            className="enter mt-10 max-w-2xl divide-y divide-border border-y border-border"
            style={enterStep(4)}
          >
            {WAYS_BACK.map((way) => (
              <li key={way.href}>
                <Link
                  href={way.href}
                  className="group ease-snappy grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 transition-transform duration-150 active:scale-[0.99] sm:grid-cols-[12rem_1fr_auto]"
                >
                  <SquiggleText className="font-display text-2xl leading-snug">
                    {way.title}
                  </SquiggleText>
                  <span className="col-start-1 text-sm text-pretty text-muted-foreground sm:col-start-auto">
                    {way.note}
                  </span>
                  <PencilArrow className="text-ink col-start-2 row-span-2 row-start-1 sm:col-start-3 sm:row-span-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* The errata slip: a note taped into the margin, in the hand, with a
            notebook grid missing its one inked square — the page that was
            meant to be here. */}
        <aside
          aria-hidden
          className="enter relative w-full max-w-80 self-start justify-self-start rounded-sm border border-border bg-card p-6 shadow-[0_1px_0_0_var(--paper-line),0_18px_40px_-28px_rgba(0,0,0,0.5)] lg:mt-24 lg:rotate-[1.5deg]"
          style={enterStep(3)}
        >
          <Tape />
          <p className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
            Errata
          </p>
          <MissingSquare className="mt-4 w-full" />
          <p className="font-hand text-ink mt-4 text-2xl leading-snug">
            p. 404 — left blank by mistake. Sorry about that.
          </p>
        </aside>
      </div>
    </section>
  )
}

/** A squared notebook grid with an empty, circled cell where the mark should be. */
function MissingSquare({ className }: { className?: string }) {
  const lines = [20, 52, 84, 116, 148]
  return (
    <svg viewBox="0 0 168 168" className={cn('text-ink', className)}>
      <defs>
        <pattern id="nf-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      {/* Every other cell inked in halftone; one left blank. */}
      <g className="text-ink-blue" opacity={0.55}>
        {[
          [20, 20],
          [84, 20],
          [52, 52],
          [116, 52],
          [20, 84],
          [52, 116],
          [116, 116],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="32" height="32" fill="url(#nf-dots)" />
        ))}
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        opacity={0.5}
      >
        {lines.map((v) => (
          <path key={`h${v}`} d={`M16 ${v}c40-1 96 1 136-1`} />
        ))}
        {lines.map((v) => (
          <path key={`v${v}`} d={`M${v} 16c1 40-1 96 1 136`} />
        ))}
      </g>
      {/* The missing one, ringed by hand, with a query in the margin. */}
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={2}>
        <path d="M96 76c14-8 34-4 38 10s-8 30-24 30-26-10-24-24c1-6 5-11 10-14" />
        <path d="M140 60c4-6 12-7 14-1s-5 9-7 13" />
        <circle cx="146" cy="80" r="1.4" fill="currentColor" />
      </g>
    </svg>
  )
}
