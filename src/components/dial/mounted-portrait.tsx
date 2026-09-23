import { InitialTile } from '@/components/dial/initial-tile'
import { Tape } from '@/components/dial/marks'
import { OptionalImage } from '@/components/dial/optional-image'
import { cn } from '@/lib/utils'

/**
 * A portrait taped onto a bordered, halftoned card — the same mount as the
 * People menu's photograph, so a person looks the same wherever they appear.
 *
 * `self-start` keeps a grid from stretching the card to its neighbour's height,
 * which would leave it empty below the photo and drag the lower tape strip down
 * with it. No `overflow-hidden`: the tape runs past the card's edge.
 */
export function MountedPortrait({
  src,
  name,
  alt = name,
  priority = false,
  className,
  style,
}: {
  src?: string | null
  name: string
  alt?: string
  priority?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const tile = (
    <InitialTile
      name={name}
      className="font-display aspect-[4/5] h-auto w-full rounded-lg text-7xl"
    />
  )

  // No photograph: the printed initial tile the roster already uses, unmounted
  // — tape and a card belong to a photograph.
  if (!src)
    return (
      <div className={cn('w-full max-w-80 self-start', className)} style={style}>
        {tile}
      </div>
    )

  return (
    <div
      className={cn(
        'relative w-full max-w-80 self-start rounded-md border border-border bg-muted/40 p-5',
        className,
      )}
      style={style}
    >
      <span aria-hidden className="halftone absolute inset-0 rounded-[inherit] opacity-[0.07]" />
      <span className="relative block">
        <OptionalImage
          src={src}
          alt={alt}
          priority={priority}
          overlay={<Tape />}
          frameClassName="aspect-[4/5] w-full rounded-sm shadow-[0_1px_0_0_var(--paper-line),0_12px_28px_-18px_rgba(0,0,0,0.55)]"
          className="h-full w-full object-cover object-top"
          fallback={tile}
        />
      </span>
    </div>
  )
}
