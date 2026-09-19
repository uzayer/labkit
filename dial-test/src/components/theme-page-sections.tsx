import { SectionHeader, ThemeIndex, sectionSpacing } from '@/components/editorial'
import { label } from '@/lib/typography'
import { cn } from '@/lib/utils'

// ─── ThemeCollaborators ───────────────────────────────────────────────────────

export interface Collaborator {
  name: string
  role: string
}

export interface CollaboratorGroup {
  institution: string
  collaborators: Collaborator[]
}

export function ThemeCollaborators({ groups }: { groups: CollaboratorGroup[] }) {
  return (
    <section className={cn('container', sectionSpacing)}>
      <SectionHeader title="Collaborators" className="mb-8" />
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.institution}>
            <h3 className={label}>{group.institution}</h3>
            <ul className="mt-3">
              {group.collaborators.map((c) => (
                <li key={c.name} className="border-t border-border py-3">
                  <p className="font-display text-lg leading-snug">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.role}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── ThemeRelatedAreas ────────────────────────────────────────────────────────

export interface RelatedTheme {
  name: string
  slug: string
  description: string
}

export function ThemeRelatedAreas({ themes }: { themes: RelatedTheme[] }) {
  return (
    <section className={cn('container', sectionSpacing, 'pb-24 md:pb-24')}>
      <SectionHeader title="Related themes" className="mb-6" />
      <ThemeIndex
        themes={themes.map((t) => ({ slug: t.slug, title: t.name, description: t.description }))}
      />
    </section>
  )
}
