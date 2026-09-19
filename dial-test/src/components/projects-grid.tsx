'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ArrowUpRight, Trophy, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface ProjectEntry {
  id: string
  /** Bengali/local name, when the source gives one. */
  localName?: string | null
  title: string
  abstract: string
  /** Primary Research Theme title; null when the Project has none. */
  theme: string | null
  keywords: string[]
  /** null when no source states the status. */
  status: 'ongoing' | 'completed' | null
  leadResearcher: string | null
  award?: { title: string }
  slug: string
}

interface ProjectsGridProps {
  projects?: ProjectEntry[]
  themes?: string[]
  keywords?: string[]
  className?: string
}

const PAGE_SIZE = 9

const ProjectsGrid = ({
  projects = [],
  themes = [],
  keywords = [],
  className,
}: ProjectsGridProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    searchParams.get('theme') || null
  )
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(
    searchParams.get('kw') || null
  )
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get('status') || 'all'
  )
  const [showAll, setShowAll] = useState(false)

  function pushParams(updates: Record<string, string | null>) {
    const sp = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) sp.delete(k)
      else sp.set(k, v)
    }
    const qs = sp.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  const handleTheme = (t: string | null) => {
    setSelectedTheme(t)
    setShowAll(false)
    pushParams({ theme: t })
  }
  const handleKeyword = (kw: string | null) => {
    setSelectedKeyword(kw)
    setShowAll(false)
    pushParams({ kw })
  }
  const handleStatus = (s: string) => {
    setSelectedStatus(s)
    setShowAll(false)
    pushParams({ status: s === 'all' ? null : s })
  }

  const filtered = projects.filter((p) => {
    const matchesTheme = selectedTheme === null || p.theme === selectedTheme
    const matchesKeyword = selectedKeyword === null || p.keywords.includes(selectedKeyword)
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus
    return matchesTheme && matchesKeyword && matchesStatus
  })

  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'ongoing' && b.status !== 'ongoing') return -1
    if (a.status !== 'ongoing' && b.status === 'ongoing') return 1
    return 0
  })

  const visible = showAll ? sorted : sorted.slice(0, PAGE_SIZE)

  return (
    <section className={cn('py-4', className)}>
      <div className="container">
        {/* Theme chips */}
        <div
          className="-mx-8 flex items-center gap-2 overflow-x-auto px-8 pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          <Badge
            variant={selectedTheme === null ? 'default' : 'outline'}
            onClick={() => handleTheme(null)}
            className={cn('cursor-pointer whitespace-nowrap', selectedTheme !== null && 'bg-background')}
          >
            All themes
          </Badge>
          {themes.map((t) => (
            <Badge
              key={t}
              variant={selectedTheme === t ? 'default' : 'outline'}
              onClick={() => handleTheme(t)}
              className={cn('cursor-pointer whitespace-nowrap', selectedTheme !== t && 'bg-background')}
            >
              {t}
            </Badge>
          ))}
        </div>

        {/* Keywords chips + Status dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
          <div
            className="-mx-8 flex items-center gap-2 overflow-x-auto px-8"
            style={{ scrollbarWidth: 'none' }}
          >
            <Badge
              variant={selectedKeyword === null ? 'default' : 'outline'}
              onClick={() => handleKeyword(null)}
              className={cn('cursor-pointer whitespace-nowrap', selectedKeyword !== null && 'bg-background')}
            >
              All keywords
            </Badge>
            {keywords.map((kw) => (
              <Badge
                key={kw}
                variant={selectedKeyword === kw ? 'default' : 'outline'}
                onClick={() => handleKeyword(kw)}
                className={cn('cursor-pointer whitespace-nowrap', selectedKeyword !== kw && 'bg-background')}
              >
                {kw}
              </Badge>
            ))}
          </div>

          <Select value={selectedStatus} onValueChange={handleStatus}>
            <SelectTrigger className="bg-background md:max-w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {sorted.length > PAGE_SIZE && (
              <div className="mt-10 flex justify-center">
                <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                  {showAll ? 'Show fewer' : `Show all ${sorted.length} projects`}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="mt-12 text-center text-muted-foreground">
            No projects match the selected filters.
          </p>
        )}
      </div>
    </section>
  )
}

const ProjectCard = ({ project }: { project: ProjectEntry }) => (
  <a
    href={`/projects/${project.slug}`}
    className="group flex flex-col justify-between gap-6 rounded-lg border border-border bg-background p-5 transition-colors hover:border-primary/30"
  >
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xl font-medium leading-tight">{project.localName ?? project.title}</p>
          {project.localName && <p className="text-sm text-muted-foreground">{project.title}</p>}
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.abstract}</p>
    </div>

    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {project.theme && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {project.theme}
          </Badge>
        )}
        {project.status && (
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              project.status === 'ongoing'
                ? 'border-green-500/30 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
          </Badge>
        )}
        {project.award && (
          <Badge
            variant="outline"
            className="border-amber-400/40 bg-amber-50 text-xs text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
          >
            <Trophy className="mr-1 size-3" />
            {project.award.title}
          </Badge>
        )}
      </div>
      {project.leadResearcher && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="size-3" />
          {project.leadResearcher}
        </p>
      )}
    </div>
  </a>
)

export { ProjectsGrid, ProjectCard }
