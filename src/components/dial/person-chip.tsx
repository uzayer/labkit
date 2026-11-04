import Link from 'next/link'

import { personInk } from '@/components/dial/initial-tile'
import { OptionalImage } from '@/components/dial/optional-image'
import { cn } from '@/lib/utils'

/**
 * A person as a single object: portrait and name in one pill, plus the
 * portrait on its own (`PersonFace`) and as a stack (`PersonFaces`).
 *
 * This is the *secondary* way the site shows people. The roster row
 * (`InitialTile` + display name + affiliation) stays the primary treatment
 * wherever people are the subject of the page — these are for places where a
 * person is a reference inside something else: a project's team in the margin,
 * the Lab's own authors on a publication row, a name in a caption.
 *
 * Themed rather than transplanted: the fill is the paper's own warm grey, a
 * portrait falls back to the person's printed initial in their ink (the same
 * ink `InitialTile` gives them, from the same seed), and a linked chip answers
 * the pointer the way the site's hover rule allows (globals.css, "Hover
 * vocabulary"): the name turns brand green and the face lifts. The pill itself
 * no longer washes green as well — that was a third response to one pointer.
 */

export interface Person {
  name: string
  /** Stable identifier — a slug. Keys the person's ink; falls back to `name`. */
  seed?: string
  /** Portrait URL. A source that fails falls back to the printed initial. */
  photo?: string | null
  /** Profile link, e.g. `/people/<slug>`. */
  href?: string
}

type Size = 'xs' | 'sm' | 'md' | 'lg'

const SIZES = {
  xs: {
    pill: 'gap-1 py-0.5 pr-2 pl-0.5 text-xs',
    portrait: 'size-5',
    px: 20,
    letter: 'text-[0.6rem]',
  },
  sm: {
    pill: 'gap-1.5 py-0.5 pr-2.5 pl-0.5 text-sm',
    portrait: 'size-6',
    px: 24,
    letter: 'text-[0.7rem]',
  },
  md: {
    pill: 'gap-2 py-1 pr-3.5 pl-1 text-base',
    portrait: 'size-8',
    px: 32,
    letter: 'text-sm',
  },
  lg: {
    pill: 'gap-2.5 py-1.5 pr-5 pl-1.5 text-xl md:text-2xl',
    portrait: 'size-11',
    px: 44,
    letter: 'text-lg',
  },
} as const

/**
 * Just the portrait: a photograph, or the person's printed initial when there
 * is none and when a source fails. Round rather than the roster's rounded
 * square — a face standing on its own reads as one object.
 */
export function PersonFace({
  name,
  seed,
  photo,
  size = 'md',
  lift = false,
  className,
}: Person & {
  size?: Size
  /**
   * Lift with the nearest hovered `group`. Only a chip asks for it: a face in
   * a publication row's author stack would otherwise lift whenever the row is
   * hovered, as a response to a link that is not the face's own.
   */
  lift?: boolean
  className?: string
}) {
  const s = SIZES[size]
  const { ink, tint } = personInk(seed ?? name)

  const letter = (
    <span
      aria-hidden
      className={cn(
        'font-display relative grid shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-background',
        lift && 'mark-lift',
        s.portrait,
        s.letter,
        ink,
        tint,
        className,
      )}
    >
      <span className="halftone absolute inset-0 opacity-25" />
      <span className="relative">{[...name.trim()][0] ?? ''}</span>
    </span>
  )

  if (!photo) return letter

  return (
    <OptionalImage
      src={photo}
      alt=""
      frameClassName={cn(
        'shrink-0 rounded-full ring-2 ring-background',
        lift && 'mark-lift',
        s.portrait,
        className,
      )}
      sizes={s.px}
      className="h-full w-full object-cover object-top"
      fallback={letter}
    />
  )
}

/**
 * A short row of overlapping portraits — the Lab's own people inside a longer
 * list of names, where there is room for faces but not for a second line. It
 * shows who, not how many: the names stay next to it, and a run too long to
 * print ends in a count.
 */
export function PersonFaces({
  people,
  size = 'sm',
  max = 4,
  className,
}: {
  people: Person[]
  size?: Size
  max?: number
  className?: string
}) {
  if (people.length === 0) return null
  const shown = people.slice(0, max)
  const rest = people.length - shown.length
  const s = SIZES[size]

  return (
    <span className={cn('inline-flex shrink-0 items-center -space-x-1.5', className)}>
      {shown.map((person) => (
        <PersonFace key={person.seed ?? person.name} {...person} size={size} />
      ))}
      {rest > 0 && (
        <span
          aria-hidden
          className={cn(
            'grid shrink-0 place-items-center rounded-full bg-muted font-mono text-muted-foreground tabular-nums ring-2 ring-background',
            s.portrait,
            s.letter,
          )}
        >
          +{rest}
        </span>
      )}
    </span>
  )
}

export function PersonChip({
  name,
  seed,
  photo,
  href,
  meta,
  size = 'md',
  className,
}: Person & {
  /** Optional trailing note — a role, an affiliation. Kept short. */
  meta?: string | null
  size?: Size
  className?: string
}) {
  const s = SIZES[size]

  const body = (
    <>
      <PersonFace name={name} seed={seed} photo={photo} size={size} lift={Boolean(href)} />
      <span className={cn('truncate font-sans leading-none', meta && 'shrink-0')}>{name}</span>
      {meta && (
        // Only the note gives way: a chip with no room keeps the person's
        // whole name and truncates their affiliation.
        <span className="min-w-0 truncate font-sans text-xs font-normal text-muted-foreground">
          <span aria-hidden className="mr-1.5 opacity-60">
            ·
          </span>
          {meta}
        </span>
      )}
    </>
  )

  const base = cn(
    'group inline-flex w-fit max-w-full items-center rounded-full bg-secondary text-secondary-foreground',
    'ease-snappy transition-[color,scale] duration-150',
    s.pill,
    className,
  )

  if (!href) {
    return <span className={base}>{body}</span>
  }

  return (
    // Pressed, it gives under the finger: feedback, not decoration, so it is
    // not counted against the two hover responses.
    <Link href={href} className={cn(base, 'hover:text-brand active:scale-[0.97]')}>
      {body}
    </Link>
  )
}
