import { InitialTile } from '@/components/dial/initial-tile'
import { cn } from '@/lib/utils'

export interface Alumni {
  name: string
  slug?: string
  photo?: string
  currentPosition?: string
  alumniYear?: number
}

interface AlumniGridProps {
  alumni: Alumni[]
  className?: string
}

/**
 * Alumni as a ruled table, newest first: where people went is the point, so
 * the current position gets the widest column.
 */
const AlumniGrid = ({ alumni, className }: AlumniGridProps) => {
  const sorted = [...alumni].sort((a, b) => (b.alumniYear ?? 0) - (a.alumniYear ?? 0))

  return (
    <table className={cn('w-full border-collapse text-left', className)}>
      <thead>
        <tr className="border-b border-border text-sm text-muted-foreground">
          <th className="w-20 pb-3 font-normal">Left</th>
          <th className="pb-3 font-normal">Name</th>
          <th className="hidden pb-3 font-normal md:table-cell">Now</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((person) => (
          <tr key={person.name} className="border-b border-border align-top">
            <td className="py-4 font-mono text-xs text-muted-foreground tabular-nums">
              {person.alumniYear ?? '—'}
            </td>
            <td className="py-4 pr-6">
              <span className="flex items-center gap-3">
                <InitialTile
                  name={person.name}
                  seed={person.slug}
                  photo={person.photo}
                  className="size-8 text-base"
                />
                <span className="font-display text-lg">{person.name}</span>
              </span>
              {person.currentPosition && (
                <span className="mt-1 block text-sm text-muted-foreground md:hidden">
                  {person.currentPosition}
                </span>
              )}
            </td>
            <td className="hidden py-4 text-sm text-pretty text-muted-foreground md:table-cell">
              {person.currentPosition ?? '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { AlumniGrid }
