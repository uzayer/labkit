import { CropMarks } from '@/components/marks'
import { OptionalImage } from '@/components/optional-image'
import { RisoArt, type RisoVariant } from '@/components/riso'
import { cn } from '@/lib/utils'

/**
 * A place where a photograph belongs.
 *
 * DIAL's own photographs are not in the prototype yet — the scraped Google
 * Sites URLs refuse hotlinks, and stock imagery would read as the Lab's own
 * work. So the slot prints a riso composition until a real photo arrives, and
 * a photo that fails to load falls back to the same drawing rather than a
 * broken frame. Every slot is a real place in the layout: when DIAL supplies
 * media, the pictures land here without the page being rebuilt around them.
 *
 * `caption` describes the slot, never the picture — no invented captions about
 * events that may not be what the photograph shows.
 */
export function PhotoSlot({
  src,
  alt,
  art = 'field',
  caption,
  aspect = 'aspect-4/3',
  taped = true,
  className,
}: {
  src?: string | null
  alt: string
  art?: RisoVariant
  caption?: string
  aspect?: string
  /** Photographs are taped down; printed compositions sit flat on the page. */
  taped?: boolean
  className?: string
}) {
  const art_ = (
    <span
      className={cn(
        'relative grid w-full place-items-center overflow-hidden rounded-md border border-border bg-muted/40',
        aspect,
      )}
    >
      <CropMarks className="text-ink/45" />
      <span aria-hidden className="halftone absolute inset-0 opacity-[0.08]" />
      <RisoArt variant={art} className="size-[72%]" />
    </span>
  )

  return (
    <figure className={cn('flex flex-col gap-2', className)}>
      {src ? (
        <span className="relative block">
          {/* `tape` is the strip itself, absolutely placed over the corner — it
              is not a wrapper, and using it as one collapses the frame. It is
              passed as `overlay` rather than rendered here as a sibling so that
              a photograph which fails to load takes its tape down with it:
              photographs are taped, printed compositions sit flat. */}
          <OptionalImage
            src={src}
            alt={alt}
            overlay={taped ? <span aria-hidden className="tape -top-2.5 left-6 z-10" /> : null}
            frameClassName={cn('w-full rounded-md', aspect, taped && '-rotate-1')}
            className="h-full w-full object-cover"
            fallback={art_}
          />
        </span>
      ) : (
        art_
      )}
      {caption && (
        <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}
