'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import { InitialTile } from '@/components/dial/initial-tile'
import { EmptySketch, SquiggleUnderline } from '@/components/dial/marks'
import { listEnter, listStagger } from '@/lib/dial/motion'
import { displaySectionTitle, label } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'
import type { TeamMember } from '@/components/dial/team5-9'

export interface RosterGroup {
  title: string
  members: TeamMember[]
  /** Collapse long groups to this many until expanded. */
  initialCount?: number
}

const matches = (m: TeamMember, q: string) =>
  m.name.toLowerCase().includes(q) ||
  m.title.toLowerCase().includes(q) ||
  m.affiliation.toLowerCase().includes(q)

/**
 * The Team roster as ruled name entries, grouped by role, with one search
 * box. Each entry leads with the person's portrait, or their printed initial
 * where there is none.
 *
 * The roster owns its section header so the search can sit in it: the title
 * on the left and the box on the right, on the header's own rule, the way a
 * list's filter sits in its heading elsewhere on the site. On its own line
 * above the first group it read as a stray field, belonging to nothing.
 */
export function PeopleRoster({
  title,
  groups,
  className,
}: {
  title: string
  groups: RosterGroup[]
  className?: string
}) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const q = query.toLowerCase().trim()

  const visibleGroups = groups
    .map((g) => ({ ...g, members: q ? g.members.filter((m) => matches(m, q)) : g.members }))
    .filter((g) => g.members.length > 0)

  return (
    <div className={className}>
      {/* The SectionHeader's shape — a rule that draws itself, the title on
          the left — with the search where its link would be. */}
      <div data-reveal className="relative pt-6">
        <span aria-hidden className="reveal-rule absolute inset-x-0 top-0 h-px bg-border" />
        <div className="reveal-item flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <h2 className={cn(displaySectionTitle, 'text-balance')}>{title}</h2>
          <div className="relative w-full md:max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search people"
              placeholder="Search by name, role, or institution"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-b border-border bg-transparent py-2 pl-6 text-base transition-colors duration-150 placeholder:text-muted-foreground focus:border-foreground focus:outline-none md:text-sm"
            />
          </div>
        </div>
      </div>

      {visibleGroups.length === 0 && (
        <div className="mt-10 flex flex-col items-start gap-4 text-muted-foreground">
          <EmptySketch />
          <p>No one matches &ldquo;{query}&rdquo;.</p>
        </div>
      )}

      <div className="mt-12 flex flex-col gap-14">
        {visibleGroups.map((group) => {
          const limit = !q && !expanded[group.title] ? group.initialCount : undefined
          const shown = limit ? group.members.slice(0, limit) : group.members
          return (
            <section key={group.title}>
              <h3 className={cn(label, 'flex items-baseline gap-2')}>
                {group.title}
                <span className="tracking-normal tabular-nums">{group.members.length}</span>
              </h3>
              <ul className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((m, i) => (
                  <li
                    key={m.slug}
                    className={cn('border-t border-border', listEnter)}
                    style={listStagger(i)}
                  >
                    <RosterEntry member={m} />
                  </li>
                ))}
              </ul>
              {limit !== undefined && group.members.length > limit && (
                <button
                  type="button"
                  onClick={() => setExpanded((e) => ({ ...e, [group.title]: true }))}
                  className="mt-4 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Show all {group.members.length}
                </button>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}

function RosterEntry({ member }: { member: TeamMember }) {
  // The whole entry is the `group`, so pointing anywhere at a person lifts
  // their printed initial and draws the squiggle under their name. The tile
  // used to carry a group-hover tilt while `group` sat only on the name link,
  // a sibling rather than an ancestor, so the tilt never fired.
  return (
    <div className="group relative flex h-full gap-4 py-5">
      <InitialTile
        name={member.name}
        seed={member.slug}
        photo={member.photo}
        className="mark-lift mt-1"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <Link
          href={`/people/${member.slug}`}
          className="font-display relative w-fit text-xl leading-snug before:absolute before:-inset-y-5 before:right-0 before:-left-14"
        >
          {member.name}
          <SquiggleUnderline />
        </Link>
        {member.title && member.title !== member.affiliation && (
          <p className="line-clamp-2 text-sm text-pretty text-muted-foreground">{member.title}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {member.affiliation}
          {member.badge && <> · {member.badge}</>}
        </p>
        {(member.scholar || member.site) && (
          <p className="relative mt-1 flex gap-3 text-xs">
            {member.scholar && (
              <a
                href={member.scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                Scholar
              </a>
            )}
            {member.site && (
              <a
                href={member.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                Website
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
