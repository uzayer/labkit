import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { CropMarks } from '@/components/dial/marks'
import { PersonChip } from '@/components/dial/person-chip'
import { PhotoSlot } from '@/components/dial/photo-slot'
import { FlatPublicationList, type PublicationYear } from '@/components/dial/publications1'
import { RisoArt } from '@/components/dial/riso'
import { themeArt, themeInkVar } from '@/components/dial/theme-marks'
import { enterStep } from '@/lib/dial/motion'
import { label, lede, pageTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Local types (no Payload CMS dependency)
// ---------------------------------------------------------------------------

type TeamMember = {
  id: string
  name: string
  role: string
  /**
   * The heading the person is filed under in the team aside ("Researchers",
   * "Alumni"). Members arrive already in the order the headings print.
   */
  group?: string
  avatarUrl?: string
  /** Stable identifier, so a person keeps one ink across the site. */
  slug?: string
  /** Profile link, where the person has a page. */
  href?: string
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

type ProjectTraceData = {
  heading: string
  steps: { label: string; detail: string }[]
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
  publications: PublicationYear[]
  content: ContentSection[]
  /** Optional project-specific evidence, shown only when the record supports it. */
  trace?: ProjectTraceData
  metaItems?: { label: string; value: string }[]
}

// ---------------------------------------------------------------------------
// Inline helpers
// ---------------------------------------------------------------------------

function timeline(
  startDate: string | undefined,
  endDate: string | undefined,
  status: ProjectData['status'],
) {
  // Year-only dates (e.g. "2017") print as the year alone rather than "Jan 2017".
  const fmt = (iso: string) =>
    /^\d{4}$/.test(iso)
      ? iso
      : new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  if (!startDate) return null
  return `${fmt(startDate)} – ${endDate ? fmt(endDate) : status === 'ongoing' ? 'present' : '—'}`
}

const slugify = (heading: string) => heading.toLowerCase().replace(/\s+/g, '-')

/** Members under their group heading, in the order they arrive. */
function teamGroups(members: TeamMember[]): [string, TeamMember[]][] {
  const groups = new Map<string, TeamMember[]>()
  for (const member of members) {
    const key = member.group ?? member.role
    groups.set(key, [...(groups.get(key) ?? []), member])
  }
  return [...groups.entries()]
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-t border-border py-3 text-sm sm:grid-cols-[7rem_minmax(0,1fr)]">
      <dt className="text-muted-foreground">{term}</dt>
      <dd>{children}</dd>
    </div>
  )
}

/**
 * A project needs a trace of the work, not a second decorative image slot.
 * These statements come from the record's abstract and body, so they explain
 * the intervention without pretending we have fieldwork imagery we do not.
 */
function ProjectTrace({
  trace,
  art,
}: {
  trace: ProjectTraceData
  art: ReturnType<typeof themeArt>
}) {
  return (
    <section
      aria-labelledby="project-trace"
      className="relative overflow-hidden rounded-md border border-border bg-secondary/35 px-6 py-7 md:px-8 md:py-9"
    >
      <RisoArt
        variant={art}
        className="pointer-events-none absolute -right-16 -bottom-16 size-52 opacity-25"
      />
      <div className="relative">
        <p className={label}>Project trace</p>
        <h2
          id="project-trace"
          className="font-display mt-3 max-w-sm text-2xl leading-tight md:text-3xl"
        >
          {trace.heading}
        </h2>
        <ol className="mt-8 space-y-5">
          {trace.steps.map((step, index) => (
            <li
              key={step.label}
              className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-border pt-4"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-sm font-medium">{step.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
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
  const soleLead = project.teamMembers.length === 1 ? project.teamMembers[0] : null

  return (
    <article className="overflow-x-clip">
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
        <p className={cn(label, 'enter flex items-center gap-3')} style={enterStep(0)}>
          Project
          {project.status && (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 tracking-normal normal-case',
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
        </div>
        {project.localName && (
          <p
            className="enter font-display mt-3 text-2xl text-muted-foreground md:text-3xl"
            style={enterStep(1)}
          >
            {project.title}
          </p>
        )}

        <div className="relative mt-10 grid gap-10 pt-6 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <span
            aria-hidden
            className="ink-rule enter-rule absolute inset-x-0 top-0 h-px"
            style={enterStep(2)}
          />
          <p className={cn(lede, 'enter w-full md:text-xl')} style={enterStep(3)}>
            {project.overview}
          </p>

          <dl
            className="enter relative min-w-0 [&>div:first-child]:border-t-0 [&>div:first-child]:pt-0"
            style={enterStep(4)}
          >
            <RisoArt
              variant={themeArt(primaryTheme)}
              className="pointer-events-none absolute -top-52 right-0 size-40 opacity-70 max-lg:hidden xl:-top-56 xl:size-48"
            />
            {span && <Fact term="Timeline">{span}</Fact>}
            {soleLead && (
              <Fact term="Led by">
                {/* The role beside the pill, not in it — the same split as the
                    team aside, so a person is one object and their role reads
                    as a fact about them. */}
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <PersonChip
                    name={soleLead.name}
                    seed={soleLead.slug}
                    photo={soleLead.avatarUrl}
                    href={soleLead.href}
                    size="sm"
                  />
                  <span className="text-muted-foreground">{soleLead.role}</span>
                </span>
              </Fact>
            )}
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

        {/* The supplied hero photo carries the page; beside it, a factual trace
            makes the intervention legible without manufacturing a second photo. */}
        <div
          className={cn(
            'mt-12',
            project.trace && 'grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]',
          )}
        >
          <PhotoSlot
            src={project.heroImageUrl}
            alt={project.title}
            art={themeArt(primaryTheme)}
            aspect={project.trace ? 'aspect-4/3 lg:aspect-auto' : 'aspect-16/7'}
            className={project.trace ? 'h-full' : undefined}
          />
          {project.trace && <ProjectTrace trace={project.trace} art={themeArt(primaryTheme)} />}
        </div>
      </header>

      {/* Body */}
      {(sections.length > 0 ||
        project.publications.length > 0 ||
        project.teamMembers.length > 0) && (
        <div className="container grid gap-16 pb-12 md:pb-16 lg:grid-cols-[1fr_22rem]">
          <div className="max-w-prose">
            {sections.map((section) => (
              <section key={section.heading} className="border-t border-border pt-6 pb-10">
                <h2
                  id={slugify(section.heading)}
                  className="font-display scroll-mt-24 text-2xl md:text-3xl"
                >
                  {section.heading}
                </h2>
                <p className="mt-4 leading-relaxed text-pretty text-muted-foreground md:text-lg">
                  {section.body}
                </p>
              </section>
            ))}
            {project.publications.length > 0 && (
              <section className="border-t border-border pt-6 pb-10">
                <h2 className="font-display text-2xl md:text-3xl">Related publications</h2>
                <p className="mt-3 text-pretty text-muted-foreground">
                  Research outputs connected to this project.
                </p>
                <FlatPublicationList yearGroups={project.publications} className="mt-6" />
              </section>
            )}
          </div>

          {project.teamMembers.length > 1 && (
            <aside className="h-fit lg:sticky lg:top-24">
              <h2 className={cn(label, 'border-t border-border pt-6')}>Project team</h2>
              {/* Filed by role: each role is a small heading and the people in
                  it are plain chips under it. The role used to ride inside each
                  pill after the name, so scanning for "who are the alumni"
                  meant reading every name first; now the roles are a column of
                  their own and the pill is only the person. */}
              <div className="mt-5 flex flex-col gap-6">
                {teamGroups(project.teamMembers).map(([group, members]) => (
                  <section key={group}>
                    <h3 className="font-mono text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
                      {group}
                      <span className="ml-2 tabular-nums opacity-60">{members.length}</span>
                    </h3>
                    <ul className="mt-2.5 flex flex-col items-start gap-2">
                      {members.map((member) => (
                        <li key={member.id} className="max-w-full">
                          <PersonChip
                            name={member.name}
                            seed={member.slug}
                            photo={member.avatarUrl}
                            href={member.href}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </aside>
          )}
        </div>
      )}
    </article>
  )
}
