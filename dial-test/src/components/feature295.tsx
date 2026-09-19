'use client'

import { useState } from 'react'
import { ArrowUpRight, BookOpen, Trophy, Users } from 'lucide-react'

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

export interface ProjectAward {
  title: string
}

export interface ResearchProject {
  id: string
  /** Bengali/local name, when the source gives one. */
  localName?: string | null
  title: string
  abstract: string
  keywords: string[]
  /** null when no source states the status. */
  status: 'ongoing' | 'completed' | null
  publicationCount: number
  teamMemberCount: number
  award?: ProjectAward
  slug: string
}

interface Feature295Props {
  projects?: ResearchProject[]
  keywords?: string[]
  className?: string
}

const Feature295 = ({ projects = [], keywords = [], className }: Feature295Props) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const filtered = projects.filter((p) => {
    const matchesKeyword = selectedKeyword === null || p.keywords.includes(selectedKeyword)
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus
    return matchesKeyword && matchesStatus
  })

  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'ongoing' && b.status !== 'ongoing') return -1
    if (a.status !== 'ongoing' && b.status === 'ongoing') return 1
    return 0
  })

  const PAGE_SIZE = 9
  const visible = showAll ? sorted : sorted.slice(0, PAGE_SIZE)

  return (
    <section className={cn('py-4', className)}>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            className="-mx-8 flex items-center gap-2 overflow-x-auto px-8"
            style={{ scrollbarWidth: 'none' }}
          >
            <Badge
              variant={selectedKeyword === null ? 'default' : 'outline'}
              onClick={() => setSelectedKeyword(null)}
              className={cn('cursor-pointer', selectedKeyword !== null && 'bg-background')}
            >
              All
            </Badge>
            {keywords.map((kw) => (
              <Badge
                key={kw}
                variant={selectedKeyword === kw ? 'default' : 'outline'}
                onClick={() => setSelectedKeyword(kw)}
                className={cn('cursor-pointer', selectedKeyword !== kw && 'bg-background')}
              >
                {kw}
              </Badge>
            ))}
          </div>

          <Select defaultValue="all" onValueChange={setSelectedStatus}>
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

const ProjectCard = ({ project }: { project: ResearchProject }) => (
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

    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
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
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <BookOpen className="size-3.5" />
          {project.publicationCount}
        </span>
        <span className="flex items-center gap-1">
          <Users className="size-3.5" />
          {project.teamMemberCount}
        </span>
      </div>
    </div>
  </a>
)

export { Feature295 }
