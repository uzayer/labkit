import Link from 'next/link'
import {
  Accessibility,
  ArrowRight,
  Brain,
  Cpu,
  GraduationCap,
  Heart,
  MapPinned,
  ShieldCheck,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

// ─── shared theme icon lookup ─────────────────────────────────────────────────

const THEME_ICONS: Record<string, LucideIcon> = {
  'accessibility-inclusion': Accessibility,
  'gender-feminist-hci': Users,
  ictd: MapPinned,
  'mental-health-wellbeing': Heart,
  'explainable-ai-ml': Brain,
  'safety-security': ShieldCheck,
  'iot-low-cost-hardware': Cpu,
  'infodemic-misinformation': TriangleAlert,
  'computing-education-community': GraduationCap,
}

// ─── ThemeCollaborators ───────────────────────────────────────────────────────

interface Collaborator {
  name: string
  role: string
}

interface CollaboratorGroup {
  institution: string
  collaborators: Collaborator[]
}

interface ThemeCollaboratorsProps {
  groups: CollaboratorGroup[]
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ThemeCollaborators({ groups }: ThemeCollaboratorsProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container">
        <Separator className="mb-10" />
        <h2 className="mb-8 text-3xl font-semibold">Collaborators</h2>
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.institution}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.institution}
              </p>
              <div className="flex flex-col gap-3">
                {group.collaborators.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <Avatar className="size-9 shrink-0 border border-transparent shadow ring-1 ring-foreground/10">
                      <AvatarFallback className="text-xs">
                        {initials(c.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-snug">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ThemeRelatedAreas ────────────────────────────────────────────────────────

interface RelatedTheme {
  name: string
  slug: string
  description: string
}

interface ThemeRelatedAreasProps {
  themes: RelatedTheme[]
}

export function ThemeRelatedAreas({ themes }: ThemeRelatedAreasProps) {
  return (
    <section className="py-8 lg:py-12">
      <div className="container">
        <Separator className="mb-10" />
        <h2 className="mb-6 text-xl font-semibold">Related Research Areas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => {
            const Icon = THEME_ICONS[t.slug]
            return (
              <Link
                key={t.slug}
                href={`/research/${t.slug}`}
                className="group flex min-h-40 flex-col justify-between rounded-[1.75rem] border bg-card p-6 shadow-sm transition-colors hover:bg-muted/60"
              >
                <div className="flex items-start justify-between">
                  {Icon && (
                    <span className="rounded-2xl border bg-background p-2.5">
                      <Icon className="size-5 text-primary" strokeWidth={1.5} />
                    </span>
                  )}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {t.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-snug">
                    {t.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
