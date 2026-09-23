import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'

import { TextLink } from '@/components/dial/editorial'
import { CropMarks, MarginNote, SquiggleText } from '@/components/dial/marks'
import { NEWS_ART, NEWS_INK_VAR, TYPE_LABELS, formatFull, type NewsEntry } from '@/lib/dial/news'
import { PhotoSlot } from '@/components/dial/photo-slot'
import { enterStep } from '@/lib/dial/motion'
import { label, pageTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

export interface NewsNeighbour {
  slug: string
  title: string
  type: NewsEntry['type']
}

export interface NewsPostData {
  entry: NewsEntry
  /** The next entry forward in time, and the next one back. */
  newer: NewsNeighbour | null
  older: NewsNeighbour | null
}

/**
 * One news entry as its own sheet.
 *
 * A news record is thin — a type, a date, a title, a paragraph, sometimes a
 * photograph and a link. So the page does not pretend to be an article: it is
 * the entry printed at plate size, with the photograph given the room it
 * deserves and the archive either side of it as the way out. The kind of
 * activity sets the page's ink, the same way a Research Theme does on a theme
 * page, so an Event and a Community entry do not read as one template.
 */
export function NewsPost({ entry, newer, older }: NewsPostData) {
  const ink = NEWS_INK_VAR[entry.type]

  return (
    <article style={{ '--header-ink': ink } as React.CSSProperties}>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <nav
          aria-label="Breadcrumb"
          className="container flex items-center gap-1.5 py-3 text-sm text-muted-foreground"
        >
          <Link href="/news" className="transition-colors hover:text-foreground">
            News
          </Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <span className="min-w-0 truncate text-foreground">{entry.title}</span>
        </nav>
      </div>

      <header className="relative isolate container pt-16 pb-12 md:pt-24">
        <CropMarks className="ink-mark-soft top-8 md:top-10" />

        <p
          className={cn(label, 'enter flex flex-wrap items-center gap-x-3 gap-y-1')}
          style={enterStep(0)}
        >
          <span className="text-ink">{TYPE_LABELS[entry.type]}</span>
          <span aria-hidden className="text-ink/50">
            /
          </span>
          <time dateTime={entry.date} className="tabular-nums">
            {formatFull(entry.date, entry.datePrecision)}
          </time>
        </p>

        <div className="enter relative mt-4 w-full" style={enterStep(1)}>
          {/* A step below a directory title: these are sentences, not words. */}
          <h1 className={cn(pageTitle, 'max-w-4xl md:text-6xl')}>{entry.title}</h1>
        </div>

        <div className="enter mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]" style={enterStep(2)}>
          <div className="max-w-prose">
            <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
              {entry.description}
            </p>
            {entry.url && (
              <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-3">
                <TextLink href={entry.url} external className="text-base">
                  Read the original announcement
                </TextLink>
                <MarginNote className="pb-0.5">on the lab&rsquo;s own record</MarginNote>
              </div>
            )}
          </div>

          {/* Held open whether or not there is a photograph: the composition
              stands in until DIAL supplies one (see PhotoSlot). */}
          <PhotoSlot
            src={entry.photo}
            alt={entry.title}
            art={NEWS_ART[entry.type]}
            aspect="aspect-4/3"
            className="lg:sticky lg:top-24 lg:h-fit"
          />
        </div>
      </header>

      {/* The archive either side. News records carry no relationships, so the
          neighbours are the entries before and after this one in time — which
          is what an archive actually offers. */}
      <nav
        aria-label="More from the archive"
        className="container grid gap-6 border-t border-border py-12 md:grid-cols-2"
      >
        {older ? (
          <Link
            href={`/news/${older.slug}`}
            className="group flex flex-col gap-2 rounded-md border border-border p-6"
          >
            <span className={cn(label, 'flex items-center gap-2')}>
              <ArrowLeft className="size-3.5" />
              Earlier
            </span>
            <SquiggleText className="font-display text-xl leading-snug text-balance">
              {older.title}
            </SquiggleText>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link
            href={`/news/${newer.slug}`}
            className="group flex flex-col items-end gap-2 rounded-md border border-border p-6 text-right md:col-start-2"
          >
            <span className={cn(label, 'flex items-center gap-2')}>
              Later
              <ArrowRight className="size-3.5" />
            </span>
            <SquiggleText className="font-display text-xl leading-snug text-balance">
              {newer.title}
            </SquiggleText>
          </Link>
        )}
      </nav>

      <div className="container pb-12 md:pb-16">
        <TextLink href="/news">Back to the whole archive</TextLink>
      </div>
    </article>
  )
}
