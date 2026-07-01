import { CheckCircle2, ChevronRight, Trophy, Link2, Share2, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

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
  title: string
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

type ProjectData = {
  title: string
  overview: string
  heroImageUrl?: string
  problem: string
  approach: string
  outcomes: string[]
  startDate: string
  endDate?: string
  status: 'ongoing' | 'completed'
  teamMembers: TeamMember[]
  themes: ResearchTheme[]
  awards: Award[]
  content: ContentSection[]
  shareLabel?: string
  metaItems?: { label: string; value: string }[]
}

// ---------------------------------------------------------------------------
// Inline helpers
// ---------------------------------------------------------------------------

function ProjectTimeline({
  startDate,
  endDate,
  status,
}: {
  startDate: string
  endDate?: string
  status: 'ongoing' | 'completed'
}) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return (
    <span>
      {fmt(startDate)} – {endDate ? fmt(endDate) : status === 'ongoing' ? 'Present' : '—'}
    </span>
  )
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center gap-3">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="size-8 rounded-full object-cover"
        />
      ) : (
        <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs font-semibold">
          {member.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>
      )}
      <div>
        <p className="text-sm font-medium leading-none">{member.name}</p>
        <p className="text-muted-foreground text-xs">{member.role}</p>
      </div>
    </div>
  )
}

function TableOfContents({ sections }: { sections: ContentSection[] }) {
  if (sections.length === 0) return null
  return (
    <nav className="hidden xl:block xl:w-56 xl:shrink-0">
      <p className="mb-3 text-sm font-semibold">On this page</p>
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.heading}>
            <a
              href={`#${s.heading.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              {s.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

export const DUMMY_PROJECT: ProjectData = {
  title: 'MobileVoice: Low-Cost Speech Interfaces for Rural Health Workers',
  overview:
    'Designing and deploying voice-driven mobile tools that help community health workers in sub-Saharan Africa navigate clinical decision-support workflows in low-literacy, low-connectivity environments.',
  heroImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&auto=format',
  problem:
    'Community health workers in rural Uganda and Tanzania use paper-based checklists that are hard to complete accurately in the field. Existing smartphone apps demand literacy and reliable data connectivity that most workers and clinics lack.',
  approach:
    'We co-designed a voice-first Android app with 24 health workers across three districts, iterating through four field study rounds. The app uses on-device speech recognition fine-tuned on local language phonemes and works fully offline, syncing to a clinic server over SMS when a data connection is unavailable.',
  outcomes: [
    'Checklist completion rate rose from 61 % to 89 % in a 12-week deployment',
    'Average task time fell by 40 % compared to the paper baseline',
    'Workers reported a 4.3/5 perceived ease-of-use after two weeks of adoption',
    'System adopted by the district health office as standard field kit',
  ],
  startDate: '2022-03-01',
  endDate: '2024-11-30',
  status: 'completed',
  teamMembers: [
    { id: '1', name: 'Ama Owusu', role: 'Principal Investigator' },
    { id: '2', name: 'Kofi Mensah', role: 'PhD Researcher' },
    { id: '3', name: 'Fatima Al-Rashid', role: 'HCI Designer' },
    { id: '4', name: 'David Nkosi', role: 'Software Engineer' },
    { id: '5', name: 'Grace Mwangi', role: 'Field Coordinator' },
    { id: '6', name: 'Ibrahim Diallo', role: 'ML Engineer' },
  ],
  themes: [
    { id: 't1', title: 'ICTD' },
    { id: 't2', title: 'Accessibility & Inclusion' },
    { id: 't3', title: 'Low-Cost Hardware' },
  ],
  awards: [
    { id: 'a1', title: 'Best Paper – CHI 2024', year: 2024 },
    { id: 'a2', title: 'SIGCHI Outstanding Research Award', year: 2024 },
  ],
  content: [
    {
      heading: 'Background & Motivation',
      body: 'Sub-Saharan Africa has one of the lowest ratios of formal health workers to population globally. Community health workers (CHWs) bridge this gap, conducting home visits and completing structured assessments for maternal and child health. Yet their tools have not kept pace: paper forms are misread, lost, and rarely analysed in aggregate. Prior work on digital CHW tools has largely assumed literacy and connectivity — assumptions that break down outside urban centres.',
    },
    {
      heading: 'System Design',
      body: 'MobileVoice consists of three layers: (1) an Android app with a voice-driven UI built on a fine-tuned Swahili/Luganda ASR model, (2) a background sync service that batches structured JSON payloads into SMS segments using a custom encoding scheme, and (3) a clinic-side Node.js server that reassembles payloads and surfaces dashboards for supervisors. The UI was designed without text labels — all navigation uses spoken prompts and earcon feedback, verified to work with $12 entry-level handsets.',
    },
    {
      heading: 'Field Study',
      body: 'We conducted four iterative field studies over 18 months in Masaka district (Uganda) and Mwanza region (Tanzania). Each round involved 6–8 CHWs conducting real patient visits with the system. Sessions were shadowed by a researcher, and daily voice logs and sync records were collected. Participatory design workshops between rounds surfaced recurring friction points and shaped the next iteration.',
    },
    {
      heading: 'Results',
      body: 'Quantitative analysis of 1,840 completed checklists showed a statistically significant improvement in completion rates and time-on-task after the first two weeks of adoption. Qualitative interviews revealed that workers valued the privacy afforded by earphone use in crowded households, and that the offline-first design reduced anxiety about connectivity. Supervisors reported faster identification of missed follow-ups.',
    },
    {
      heading: 'Contributions',
      body: 'This project contributes: (1) a replication-ready design pattern for voice-first clinical decision support under low-literacy / low-connectivity constraints, (2) a public dataset of anonymised CHW interaction logs (N=1,840), and (3) a freely licensed Android library for SMS-based structured-data sync. All artefacts are available via our project repository.',
    },
  ],
  shareLabel: 'Share this project:',
  metaItems: [{ label: 'Funder', value: 'Wellcome Trust (grant 224551/Z/21/Z)' }],
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProjectPost({ project = DUMMY_PROJECT }: { project?: ProjectData }) {
  const timelineMeta = {
    label: 'Timeline',
    value: (
      <ProjectTimeline
        startDate={project.startDate}
        endDate={project.endDate}
        status={project.status}
      />
    ),
  }

  const metaItems = [
    timelineMeta,
    ...(project.metaItems ?? []).map((item) => ({
      label: item.label,
      value: <span>{item.value}</span>,
    })),
  ]

  const visibleTeam = project.teamMembers.slice(0, 4)
  const extraTeam = project.teamMembers.slice(4)

  return (
    <section className="py-32">
      <div className="container">
        {/* Header row */}
        <div className="mx-auto flex max-w-prose flex-col items-center justify-between gap-10 lg:max-w-none lg:flex-row">
          <div className="w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/research">Research</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Project</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="mt-10 text-balance text-5xl font-semibold lg:text-7xl">
              {project.title}
            </h1>
          </div>
          {project.heroImageUrl && (
            <div className="max-h-[524px] w-full overflow-hidden rounded-xl border">
              <img
                src={project.heroImageUrl}
                alt={project.title}
                className="max-h-[524px] w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="relative mt-20 flex flex-col gap-x-6 gap-y-16 lg:flex-row">
          {/* Sidebar */}
          <aside className="h-fit w-full lg:sticky lg:top-10 lg:w-64 lg:shrink-0">
            {project.awards.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="size-5" />
                    Awards &amp; Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.awards.map((award) => (
                      <Badge
                        key={award.id}
                        variant="outline"
                        className="max-w-full whitespace-normal break-words"
                      >
                        {award.title} ({award.year})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mb-6">
              <h2 className="font-semibold">Overview</h2>
              <p className="text-muted-foreground mt-1 text-sm">{project.overview}</p>
              {project.themes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.themes.map((theme) => (
                    <a key={theme.id} href="#">
                      <Badge variant="outline">{theme.title}</Badge>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
              {metaItems.map((item, i) => (
                <div key={`${item.label}-${i}`} className="col-span-2 lg:col-span-1">
                  <h2 className="font-semibold">{item.label}</h2>
                  <div className="text-muted-foreground mt-1 text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            {project.teamMembers.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 font-semibold">Project Team</h2>
                <div className="flex flex-col gap-4">
                  {visibleTeam.map((m) => (
                    <TeamMemberCard key={m.id} member={m} />
                  ))}
                  {extraTeam.length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger className="hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="size-4" />
                          <span>Show more</span>
                        </div>
                        <Badge variant="secondary">{extraTeam.length}</Badge>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 ml-6 space-y-4 border-l pl-3">
                        {extraTeam.map((m) => (
                          <TeamMemberCard key={m.id} member={m} />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col">
              <span className="text-muted-foreground mb-2 text-sm">
                {project.shareLabel ?? 'Share this content:'}
              </span>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Link2 className="size-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Share2 className="size-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Globe className="size-5" />
                </a>
              </div>
            </div>
          </aside>

          {/* Main content + TOC */}
          <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            <div className="mx-auto max-w-prose flex-1 lg:max-w-4xl lg:px-20">
              {/* Problem / Approach / Outcomes */}
              <div className="grid gap-x-10 gap-y-7 rounded-3xl border p-6 lg:grid-cols-2 lg:gap-y-10 lg:border-none lg:p-0">
                {project.problem && (
                  <div>
                    <h2 className="text-xl font-semibold">Problem</h2>
                    <p className="text-muted-foreground mt-3">{project.problem}</p>
                  </div>
                )}
                {project.problem && project.approach && (
                  <Separator className="w-full lg:hidden" />
                )}
                {project.approach && (
                  <div>
                    <h2 className="text-xl font-semibold">Approach</h2>
                    <p className="text-muted-foreground mt-3">{project.approach}</p>
                  </div>
                )}
                {project.outcomes.length > 0 && (
                  <div className="border-t pt-10 lg:col-span-2">
                    <h2 className="text-xl font-semibold">Outcomes</h2>
                    <ul className="mt-3 grid gap-x-10 gap-y-3 lg:grid-cols-2">
                      {project.outcomes.map((outcome, i) => (
                        <li key={i} className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                          <p className="font-semibold">{outcome}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Rich content sections */}
              <div className="prose dark:prose-invert mt-20">
                {project.content.map((section) => (
                  <div key={section.heading}>
                    <h2
                      id={section.heading.toLowerCase().replace(/\s+/g, '-')}
                      className="scroll-mt-20"
                    >
                      {section.heading}
                    </h2>
                    <p>{section.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <TableOfContents sections={project.content} />
          </div>
        </div>
      </div>
    </section>
  )
}
