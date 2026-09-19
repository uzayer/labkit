import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { CropMarks, Squiggle } from '@/components/marks'
import { PhotoSlot } from '@/components/photo-slot'
import { RisoArt } from '@/components/riso'
import { themeArt, themeInkVar } from '@/components/theme-marks'
import { enterStep } from '@/lib/motion'
import { label, lede, pageTitle } from '@/lib/typography'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Local types (no Payload CMS dependency)
// ---------------------------------------------------------------------------

type TeamMember = {
  id: string
  name: string
  role: string
  avatarUrl?: string
}

type ResearchTheme = {
  id: string
  /** The Theme's slug, which is what its ink and composition are keyed by. */
  slug?: string
  title: string
  /** Link target for the theme, e.g. /research/<slug>. */
  href?: string
}

type Award = {
  id: string
  title: string
  year: number
}

type ContentSection = {
  heading: string
  body: string
}

export type ProjectData = {
  /** English title. */
  title: string
  /** Bengali/local name; when present it leads and the title becomes the subtitle. */
  localName?: string
  overview: string
  heroImageUrl?: string
  /** ISO date; may be year-only. Absent when no source states it. */
  startDate?: string
  endDate?: string
  status: 'ongoing' | 'completed' | null
  teamMembers: TeamMember[]
  themes: ResearchTheme[]
  awards: Award[]
  content: ContentSection[]
  metaItems?: { label: string; value: string }[]
}

// ---------------------------------------------------------------------------
// Inline helpers
// ---------------------------------------------------------------------------

function timeline(startDate: string | undefined, endDate: string | undefined, status: ProjectData['status']) {
  // Year-only dates (e.g. "2017") print as the year alone rather than "Jan 2017".
  const fmt = (iso: string) =>
    /^\d{4}$/.test(iso)
      ? iso
      : new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  if (!startDate) return null
  return `${fmt(startDate)} – ${endDate ? fmt(endDate) : status === 'ongoing' ? 'present' : '—'}`
}

const slugify = (heading: string) => heading.toLowerCase().replace(/\s+/g, '-')

function Initials({ name }: { name: string }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
      {name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)}
    </span>
  )
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3 text-sm">
      <dt className="text-muted-foreground">{term}</dt>
      <dd>{children}</dd>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProjectPost({ project }: { project: ProjectData }) {
  const span = timeline(project.startDate, project.endDate, project.status)
  // The first Theme a Project is filed under decides its plate.
  const primaryTheme = project.themes[0]?.slug ?? ''
  // The abstract is already the lede; the body starts with the record's own sections.
  const sections = project.content.filter((s) => s.body !== project.overview)

  return (
    <article>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <nav
          aria-label="Breadcrumb"
          className="container flex items-center gap-1.5 py-3 text-sm text-muted-foreground"
        >
          <Link href="/projects" className="transition-colors hover:text-foreground">
            Projects
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{project.title}</span>
        </nav>
      </div>

      {/* Header. A Project is printed in its primary Theme's ink and
          composition, so arriving from a Theme page the colour carries over
          instead of resetting to the default plate. */}
      <header
        style={{ '--header-ink': themeInkVar(primaryTheme) } as React.CSSProperties}
        className="relative isolate container pt-16 pb-12 md:pt-24"
      >
        <CropMarks className="ink-mark-soft top-8 md:top-10" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -right-5 -z-10 w-[26rem] overflow-x-clip overflow-y-visible max-lg:hidden xl:w-[32rem]"
        >
          <RisoArt
            variant={themeArt(primaryTheme)}
            className="absolute -top-10 -right-32 size-[34rem] opacity-90 xl:-right-36 xl:size-[40rem]"
          />
        </div>
        <p className={cn(label, 'enter flex items-center gap-3')} style={enterStep(0)}>
          Project
          {project.status && (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 normal-case tracking-normal',
                project.status === 'ongoing' ? 'text-brand' : 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  project.status === 'ongoing' ? 'bg-brand' : 'bg-muted-foreground/50',
                )}
              />
              {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
            </span>
          )}
        </p>
        <div className="enter relative mt-4 w-fit" style={enterStep(1)}>
          <h1 className={pageTitle}>{project.localName ?? project.title}</h1>
          <Squiggle className="ink-mark mt-1 max-w-md" />
        </div>
        {project.localName && (
          <p className="enter mt-3 font-display text-2xl text-muted-foreground md:text-3xl" style={enterStep(1)}>
            {project.title}
          </p>
        )}

        <div className="relative mt-10 grid gap-10 pt-6 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <span aria-hidden className="ink-rule enter-rule absolute inset-x-0 top-0 h-px" style={enterStep(2)} />
          <p className={cn(lede, 'enter md:text-xl')} style={enterStep(3)}>
            {project.overview}
          </p>

          <dl className="enter [&>div:first-child]:border-t-0 [&>div:first-child]:pt-0" style={enterStep(4)}>
            {span && <Fact term="Timeline">{span}</Fact>}
            {project.themes.length > 0 && (
              <Fact term="Themes">
                <ul className="flex flex-col gap-1">
                  {project.themes.map((theme) => (
                    <li key={theme.id}>
                      <Link
                        href={theme.href ?? '/research'}
                        className="underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
                      >
                        {theme.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Fact>
            )}
            {project.awards.map((award) => (
              <Fact key={award.id} term="Award">
                {award.title}, {award.year}
              </Fact>
            ))}
            {project.metaItems?.map((item, i) => (
              <Fact key={`${item.label}-${i}`} term={item.label}>
                {/^https?:\/\//.test(item.value) ? (
                  <a
                    href={item.value}
                    className="break-all underline decoration-border underline-offset-4 hover:decoration-current"
                  >
                    {item.value.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  item.value
                )}
              </Fact>
            ))}
          </dl>
        </div>

        {/* Where this Project's photographs go. The slots are here whether or
            not DIAL has supplied them yet, so the pictures land in a layout
            that already expects them. */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <PhotoSlot
            src={project.heroImageUrl}
            alt={project.title}
            art={themeArt(primaryTheme)}
            aspect="aspect-4/3"
          />
          <PhotoSlot alt={`Fieldwork for ${project.title}`} art="field" aspect="aspect-4/3" />
        </div>
      </header>

      {/* Body */}
      {(sections.length > 0 || project.teamMembers.length > 0) && (
        <div className="container grid gap-16 pb-24 lg:grid-cols-[1fr_22rem]">
          <div className="max-w-prose">
            {sections.map((section) => (
              <section key={section.heading} className="border-t border-border pt-6 pb-10">
                <h2 id={slugify(section.heading)} className="scroll-mt-24 font-display text-2xl md:text-3xl">
                  {section.heading}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground md:text-lg">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          {project.teamMembers.length > 0 && (
            <aside className="h-fit lg:sticky lg:top-24">
              <h2 className={cn(label, 'border-t border-border pt-6')}>Project team</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {project.teamMembers.map((member) => (
                  <li key={member.id} className="flex items-center gap-3">
                    {member.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- local placeholder media
                      <img src={member.avatarUrl} alt="" className="size-9 rounded-full object-cover" />
                    ) : (
                      <Initials name={member.name} />
                    )}
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      )}
    </article>
  )
}
