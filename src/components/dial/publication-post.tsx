import { Fragment } from 'react'
import Link from 'next/link'
import { ChevronRight, FileText, LockOpen } from 'lucide-react'

import { ClosingNote } from '@/components/dial/closing-note'
import { InkBand, SectionHeader, TextLink, sectionSpacing } from '@/components/dial/editorial'
import { PersonChip } from '@/components/dial/person-chip'
import { AsteriskMark, CropMarks, SquiggleUnderline, TickMark } from '@/components/dial/marks'
import { CitationPanel } from '@/components/dial/publication-cite'
import type { Citations } from '@/lib/dial/cite'
import { FlatPublicationList, type PublicationYear } from '@/components/dial/publications1'
import { RisoArt } from '@/components/dial/riso'
import { themeArt, themeInkVar } from '@/components/dial/theme-marks'
import { enterStep } from '@/lib/dial/motion'
import { label, pageTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Local types (no Payload CMS dependency)
// ---------------------------------------------------------------------------

export type PublicationAuthor = {
  id: string
  name: string
  /** `/people/<slug>` when the author is a Team Member the site shows. */
  href?: string | null
  /** Their standing in the Lab; absent for co-authors from outside it. */
  role?: string | null
  photo?: string | null
}

export type PublicationPostData = {
  title: string
  year: number
  /** "Conference Paper", "Journal Article", … */
  typeLabel: string | null
  /** Printed only when the paper is not simply published — in press, a preprint. */
  statusLabel: string | null
  authors: PublicationAuthor[]
  venue: {
    name: string
    shortName?: string | null
    url?: string | null
  } | null
  abstract?: string | null
  /** The Lab's own APA string; absent where no source carries one. */
  /** Generated from the record: ACM, APA, BibTeX. */
  citations: Citations
  doi?: string | null
  externalUrl?: string | null
  pdfLink?: string | null
  isOpenAccess: boolean
  themes: { id: string; slug: string; title: string; href: string }[]
  projects: { id: string; slug: string; title: string; href: string }[]
  awards: { id: string; title: string; year: number; organization?: string | null }[]
  /** Other papers under the same Theme or from the same Venue. */
  related: PublicationYear[]
}

// ---------------------------------------------------------------------------
// Inline helpers
// ---------------------------------------------------------------------------

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-border py-3 text-sm">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}

/**
 * Where an award came from. The granting body is often recorded with the year
 * already in it ("ACM CHI 2019"), so the year is only added when saying it
 * twice would be the alternative.
 */
function awardOrigin(award: PublicationPostData['awards'][number]): string {
  const year = String(award.year)
  if (!award.organization) return year
  return award.organization.includes(year) ? award.organization : `${award.organization} · ${year}`
}

const linkUnderline =
  'underline decoration-border underline-offset-4 transition-colors hover:decoration-current'

/**
 * The byline, as a paper prints it: every author in submission order, in one
 * running line. The ones the Lab has a record for are links, the rest are set
 * as plain type — a name without a profile is not a broken link, it is a
 * co-author somewhere else.
 */
function Byline({ authors }: { authors: PublicationAuthor[] }) {
  return (
    <p className="max-w-4xl text-lg leading-relaxed text-pretty text-muted-foreground">
      {authors.map((author, i) => (
        <Fragment key={author.id}>
          {i > 0 && ', '}
          {author.href ? (
            <Link href={author.href} className="relative inline-block text-foreground">
              {author.name}
              <SquiggleUnderline />
            </Link>
          ) : (
            author.name
          )}
        </Fragment>
      ))}
    </p>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * One paper's own page — the offprint: the title page a journal runs in front
 * of a reprint, carrying the title, the byline, where it appeared, the abstract
 * and the citation, and nothing the paper itself does not say.
 *
 * It is printed in its first Research Theme's ink and composition, the way a
 * Project is, so arriving from a Theme or a Project the colour carries over
 * rather than resetting to the default plate.
 */
export function PublicationPost({ pub }: { pub: PublicationPostData }) {
  const primaryTheme = pub.themes[0]?.slug ?? ''
  const ink = themeInkVar(primaryTheme)
  const labAuthors = pub.authors.filter((a) => a.href)
  const paperUrl = pub.pdfLink ?? pub.externalUrl ?? (pub.doi ? `https://doi.org/${pub.doi}` : null)

  return (
    <article>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <nav
          aria-label="Breadcrumb"
          className="container flex items-center gap-1.5 py-3 text-sm text-muted-foreground"
        >
          <Link href="/publications" className="transition-colors hover:text-foreground">
            Publications
          </Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <span className="min-w-0 truncate text-foreground">{pub.title}</span>
        </nav>
      </div>

      <header
        style={{ '--header-ink': ink } as React.CSSProperties}
        className="relative isolate container pt-16 pb-12 md:pt-24"
      >
        <CropMarks className="ink-mark-soft top-8 md:top-10" />

        <p
          className={cn(label, 'enter flex flex-wrap items-center gap-x-3 gap-y-1')}
          style={enterStep(0)}
        >
          {pub.typeLabel ?? 'Publication'}
          <span aria-hidden className="text-ink/50">
            /
          </span>
          <span className="tabular-nums">{pub.year}</span>
          {pub.statusLabel && (
            <span className="text-ink tracking-normal normal-case">{pub.statusLabel}</span>
          )}
        </p>

        <div className="enter relative mt-4 w-fit max-w-4xl" style={enterStep(1)}>
          {/* Set a step below a directory page's title: a paper title is a
              sentence, sometimes two, and at 7xl it stops being readable. */}
          <h1 className={cn(pageTitle, 'md:text-6xl')}>{pub.title}</h1>
        </div>

        <div className="enter mt-7" style={enterStep(2)}>
          <Byline authors={pub.authors} />
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {pub.venue && (
              <span className="font-medium text-foreground">
                {pub.venue.url ? (
                  <a
                    href={pub.venue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkUnderline}
                  >
                    {pub.venue.shortName ?? pub.venue.name}
                  </a>
                ) : (
                  (pub.venue.shortName ?? pub.venue.name)
                )}{' '}
                {pub.year}
              </span>
            )}
            {pub.isOpenAccess && (
              <span className="inline-flex items-center gap-1.5">
                <LockOpen className="size-3.5" aria-hidden />
                Open access
              </span>
            )}
          </p>
        </div>

        {/* The two things a reader came for. Set as text links, not buttons:
            this page has no filled action, and a paper is a link to a paper. */}
        {(paperUrl || pub.doi) && (
          <div
            className="enter mt-8 flex flex-wrap items-center gap-x-8 gap-y-3"
            style={enterStep(3)}
          >
            {paperUrl && (
              <TextLink external href={paperUrl} className="text-base">
                <span className="inline-flex items-center gap-2">
                  <FileText className="size-4" aria-hidden />
                  Read the paper
                </span>
              </TextLink>
            )}
            {pub.doi && (
              <a
                href={`https://doi.org/${pub.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn('font-mono text-xs text-muted-foreground', linkUnderline)}
              >
                doi:{pub.doi}
              </a>
            )}
          </div>
        )}

        {/* Abstract on the measure, the record's own facts in the margin —
            the same split the Project page uses, so a paper and a project read
            as two entries in one filing cabinet. */}
        <div className="relative mt-12 grid gap-10 pt-6 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <span
            aria-hidden
            className="ink-rule enter-rule absolute inset-x-0 top-0 h-px"
            style={enterStep(4)}
          />

          <div className="enter max-w-prose" style={enterStep(5)}>
            <p className={cn(label, 'flex items-center gap-2')}>
              <TickMark className="ink-mark" />
              Abstract
            </p>
            {pub.abstract ? (
              <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
                {pub.abstract}
              </p>
            ) : (
              // Said plainly rather than left blank: the record genuinely has
              // no abstract, and inventing one would be inventing the paper.
              <p className="mt-4 text-muted-foreground">
                No abstract is recorded for this paper.{' '}
                {paperUrl
                  ? 'The citation below is the whole of what the Lab holds; the paper itself is linked above.'
                  : 'The citation below is the whole of what the Lab holds.'}
              </p>
            )}
          </div>

          <dl className="enter relative" style={enterStep(6)}>
            <RisoArt
              variant={themeArt(primaryTheme)}
              className="pointer-events-none absolute -top-52 right-0 size-40 opacity-70 max-lg:hidden xl:-top-56 xl:size-48"
            />
            {pub.venue && (
              <Fact term="Venue">
                {pub.venue.url ? (
                  <a
                    href={pub.venue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkUnderline}
                  >
                    {pub.venue.name}
                  </a>
                ) : (
                  pub.venue.name
                )}
              </Fact>
            )}
            <Fact term="Published">{pub.year}</Fact>
            {pub.typeLabel && <Fact term="Type">{pub.typeLabel}</Fact>}
            <Fact term="Access">{pub.isOpenAccess ? 'Open access' : "Publisher's site"}</Fact>
            {pub.doi && (
              <Fact term="DOI">
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('font-mono text-xs break-all', linkUnderline)}
                >
                  {pub.doi}
                </a>
              </Fact>
            )}
            {pub.themes.length > 0 && (
              <Fact term="Themes">
                <ul className="flex flex-col gap-1">
                  {pub.themes.map((theme) => (
                    <li key={theme.id}>
                      <Link href={theme.href} className={linkUnderline}>
                        {theme.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Fact>
            )}
            {pub.projects.length > 0 && (
              <Fact term="Project">
                <ul className="flex flex-col gap-1">
                  {pub.projects.map((project) => (
                    <li key={project.id}>
                      <Link href={project.href} className={linkUnderline}>
                        {project.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Fact>
            )}
          </dl>
        </div>
      </header>

      {/* Body: the citation on the measure, the Lab's own authors in the margin. */}
      <div className="container grid gap-16 pb-12 md:pb-16 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <section className="max-w-prose border-t border-border pt-6">
          <h2 className="font-display text-2xl md:text-3xl">Cite this paper</h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            ACM Reference Format, APA, or BibTeX, generated from this record.
          </p>
          <CitationPanel citations={pub.citations} className="mt-6" />
        </section>

        {labAuthors.length > 0 && (
          <aside className="h-fit lg:sticky lg:top-24">
            <h2 className={cn(label, 'border-t border-border pt-6')}>From the Lab</h2>
            {/* A margin reference to people, not a roster — the same chip the
                Project page uses for its team. */}
            <ul className="mt-5 flex flex-col gap-3">
              {labAuthors.map((author) => (
                <li key={author.id}>
                  <PersonChip
                    name={author.name}
                    seed={author.id}
                    photo={author.photo}
                    href={author.href ?? undefined}
                    size="sm"
                    meta={author.role}
                  />
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {/* The page's one loud moment, and only when the paper earned one. */}
      {pub.awards.length > 0 && (
        <InkBand ink={ink}>
          <p className={cn(label, 'mb-6 flex items-center gap-2')}>
            <AsteriskMark className="ink-mark" />
            Recognition
          </p>
          <ul className="flex max-w-4xl flex-col gap-8">
            {pub.awards.map((award) => (
              <li key={award.id}>
                <p className="font-display text-3xl leading-tight text-pretty md:text-5xl">
                  {award.title}
                </p>
                <p className="mt-3 text-muted-foreground">{awardOrigin(award)}</p>
              </li>
            ))}
          </ul>
        </InkBand>
      )}

      {pub.related.length > 0 && (
        <section className={cn('container', sectionSpacing)}>
          <SectionHeader
            title="Read next"
            description="Papers filed under the same Research Theme, or from the same venue."
            className="mb-6"
          />
          <FlatPublicationList yearGroups={pub.related} showYear />
        </section>
      )}

      <ClosingNote
        heading="All of DIAL's papers, in one list."
        links={[
          { text: 'Browse publications', href: '/publications' },
          { text: 'Research themes', href: '/research' },
        ]}
      />
    </article>
  )
}
