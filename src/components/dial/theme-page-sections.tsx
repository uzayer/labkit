import { FieldNote } from '@/components/dial/field-note'
import { SectionHeader, ThemeIndex, sectionSpacing } from '@/components/dial/editorial'
import { displaySectionTitle, label } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

// ─── ThemeStakes ─────────────────────────────────────────────────────────────

export interface ThemeStakesData {
  /**
   * What the field's term means, without the field's vocabulary. Every one of
   * these nine titles is jargon to someone — "Feminist HCI", "ICT for
   * Development", "Explainable AI" all name a discipline rather than describe
   * one — and a visitor who cannot decode the title cannot decide whether the
   * page below is for them.
   */
  plainly: string
  /** Why the area matters here, argued rather than asserted. */
  why: string
  /** A piece of the field's own history, set in the margin. Always sourced. */
  note: { text: string; source: string }
}

/**
 * The opening section of a Theme page: the title in plain words, the stake, and
 * one note from the field's history.
 *
 * It sits above Projects and Publications because the rest of the page assumes
 * a reader who already knows what the theme is. Most arrivals here are from a
 * search engine, and the projects and papers below answer "what has DIAL done"
 * for someone who has not yet been told "about what, and why".
 */
export function ThemeStakes({ stakes }: { stakes: ThemeStakesData }) {
  return (
    <section className={cn('container', sectionSpacing, 'pt-0 md:pt-0')}>
      <div data-reveal className="relative grid gap-x-16 gap-y-8 pt-6 lg:grid-cols-[1fr_auto]">
        <span aria-hidden className="reveal-rule absolute inset-x-0 top-0 h-px bg-border" />
        <div className="reveal-item max-w-3xl">
          <p className={cn(label, 'mb-4')}>Why this matters</p>
          <p className={cn(displaySectionTitle, 'text-balance')}>{stakes.plainly}</p>
          <p className="mt-6 max-w-prose leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {stakes.why}
          </p>
        </div>
        <FieldNote source={stakes.note.source} className="reveal-item lg:mt-14">
          {stakes.note.text}
        </FieldNote>
      </div>
    </section>
  )
}

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
    <section className={cn('container', sectionSpacing)}>
      <SectionHeader title="Related themes" className="mb-6" />
      <ThemeIndex
        themes={themes.map((t) => ({ slug: t.slug, title: t.name, description: t.description }))}
      />
    </section>
  )
}
