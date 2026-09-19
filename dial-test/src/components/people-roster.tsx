'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import { InitialTile } from '@/components/initial-tile'
import { EmptySketch, SquiggleUnderline } from '@/components/marks'
import { listEnter, listStagger } from '@/lib/motion'
import { label } from '@/lib/typography'
import { cn } from '@/lib/utils'
import type { TeamMember } from '@/components/team5-9'

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
 * box. No initials avatars: without photos they repeat the name in a circle.
 */
export function PeopleRoster({ groups, className }: { groups: RosterGroup[]; className?: string }) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const q = query.toLowerCase().trim()

  const visibleGroups = groups
    .map((g) => ({ ...g, members: q ? g.members.filter((m) => matches(m, q)) : g.members }))
    .filter((g) => g.members.length > 0)

  return (
    <div className={className}>
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          aria-label="Search people"
          placeholder="Search by name, role, or institution"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-b border-border bg-transparent py-2 pl-6 text-sm transition-colors duration-150 placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
        />
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
                <span className="tabular-nums tracking-normal">{group.members.length}</span>
              </h3>
              <ul className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((m, i) => (
                  <li key={m.slug} className={cn('border-t border-border', listEnter)} style={listStagger(i)}>
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
  return (
    <div className="flex h-full gap-4 py-5">
      <InitialTile name={member.name} seed={member.slug} className="mt-1 group-hover:rotate-0" />
      <div className="flex min-w-0 flex-col gap-1">
      <Link
        href={`/people/${member.slug}`}
        className="group relative w-fit font-display text-xl leading-snug"
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
        <p className="mt-1 flex gap-3 text-xs">
          {member.scholar && (
            <a href={member.scholar} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">
              Scholar
            </a>
          )}
          {member.site && (
            <a href={member.site} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">
              Website
            </a>
          )}
        </p>
      )}
      </div>
    </div>
  )
}
