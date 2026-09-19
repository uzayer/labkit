import { cn } from '@/lib/utils'

/**
 * Drawn marks for the communities DIAL designs with, in the same hand as the
 * Research Theme glyphs.
 *
 * Each one draws an *object or setting* — a cane, a spool, a tent — never a
 * person. Drawing the people would be inventing likenesses of communities the
 * Lab actually works with; drawing what is in their hands says the same thing
 * without claiming to picture anyone.
 *
 * Keyed by label, so a community without a drawing renders nothing rather than
 * borrowing another's picture.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

type MarkProps = { className?: string }

const wrap = (children: React.ReactNode, className?: string) => (
  <svg aria-hidden viewBox="0 0 32 32" className={cn('size-6', className)}>
    <g {...stroke}>{children}</g>
  </svg>
)

/** Blind users: a white cane, handle and tip, over the ground it reads. */
const Cane = ({ className }: MarkProps) => wrap(
  <>
    <path d="M18 5c3-1 5 0 4 3l-8 18" />
    <path d="M14 26a2 2 0 1 0 0-.1" />
    <path d="M4 29h9M19 29h9" />
  </>,
  className,
)

/** Stroke patients: a pulse that resolves into a heart. */
const Pulse = ({ className }: MarkProps) => wrap(
  <>
    <path d="M3 16h4l2.5-6 3.5 12 2.5-6h2" />
    <path d="M22 26c-3-2.6-7-5.6-7-9.6 0-3 4-4.4 6-1.6 2-2.8 6-1.4 6 1.6 0 4-4 7-5 9.6z" />
  </>,
  className,
)

/** Low-literacy users: a page read aloud rather than read. */
const Spoken = ({ className }: MarkProps) => wrap(
  <>
    <path d="M6 4h12v24H6z" />
    <path d="M9 10c2-1 4 1 6 0M9 15c2-1 4 1 6 0M9 20h4" />
    <path d="M22 12c1.8 1.6 1.8 6.4 0 8M26 9c3 2.8 3 11.2 0 14" />
  </>,
  className,
)

/** Garment workers: a spool of thread and the needle it feeds. */
const Loom = ({ className }: MarkProps) => wrap(
  <>
    <path d="M9 5h10M9 27h10" />
    <path d="M11 5v22M17 5v22" />
    <path d="M11 10h6M11 16h6M11 22h6" />
    <path d="M24 26c3-3 3-9 0-12" />
    <path d="M24 9a1.6 1.6 0 1 0 0-.1" />
  </>,
  className,
)

/** Rohingya refugees: a tent with its flap open. */
const Shelter = ({ className }: MarkProps) => wrap(
  <>
    <path d="M16 5L5 26h22z" />
    <path d="M16 5v21" />
    <path d="M12 26c1-5 2.4-8 4-9M20 26c-1-5-2.4-8-4-9" />
  </>,
  className,
)

/** Domestic workers: a house and the broom that is worked in it. */
const Doorway = ({ className }: MarkProps) => wrap(
  <>
    <path d="M4 15L14 6l10 9" />
    <path d="M7 14v14h14V14" />
    <path d="M26 4l-4 12" />
    <path d="M19 15l6 2-1.5 5-6-2z" />
  </>,
  className,
)

/** Social media users: a post, shared and liked. */
const Feed = ({ className }: MarkProps) => wrap(
  <>
    <path d="M4 6h17v12H10l-6 5V6z" />
    <path d="M12.5 14c-1.8-1.4-4-3-4-5 0-1.8 2.4-2.6 4-.6 1.6-2 4-1.2 4 .6 0 2-2.2 3.6-4 5z" />
    <path d="M24 16v9h-3l-3 3v-3h-2" />
  </>,
  className,
)

/** Teenagers online: a phone, held. */
const Phone = ({ className }: MarkProps) => wrap(
  <>
    <rect x="9" y="3" width="14" height="26" rx="3" />
    <path d="M14 6.5h4" />
    <path d="M13 25h6" />
  </>,
  className,
)

/** Rural communities: stalks of rice bending in a field. */
const Field = ({ className }: MarkProps) => wrap(
  <>
    <path d="M3 28h26" />
    <path d="M10 28c-1-7 0-12 3-16M10 17c-3-1-5-3-5-6 3 0 5 2 6 5M11 12c1-3 3-5 6-5 0 3-2 5-5 6" />
    <path d="M22 28c0-5 .6-9 2-12M22 20c-2.4-.8-4-2.4-4-4.6 2.4 0 4.2 1.4 5 3.6" />
  </>,
  className,
)

/** University students: a graduation cap. */
const Books = ({ className }: MarkProps) => wrap(
  <>
    <path d="M16 7l13 5-13 5-13-5z" />
    <path d="M8 14.5V22c0 2.6 3.6 4.4 8 4.4s8-1.8 8-4.4v-7.5" />
    <path d="M29 12v7" />
  </>,
  className,
)

/** School teachers: a blackboard on its easel, chalked. */
const Board = ({ className }: MarkProps) => wrap(
  <>
    <rect x="4" y="4" width="24" height="16" rx="1.5" />
    <path d="M9 10c2.6-1.6 4.4 1.6 7 0s4.4-1.4 6.6 0" />
    <path d="M9 15h7" />
    <path d="M9 28l4-8M23 28l-4-8M16 20v8" />
  </>,
  className,
)

/** STEM learners: a flask, mid-reaction. */
const Flask = ({ className }: MarkProps) => wrap(
  <>
    <path d="M13 3v10L6 26c-.8 1.7.3 3 2 3h16c1.7 0 2.8-1.3 2-3l-7-13V3" />
    <path d="M11 3h10" />
    <path d="M9.5 20h13" />
    <path d="M14 24h.1M19 23h.1" />
  </>,
  className,
)

const COMMUNITY_MARKS: Record<string, (props: MarkProps) => React.ReactElement> = {
  'Blind users': Cane,
  'Stroke patients': Pulse,
  'Low-literacy users': Spoken,
  'Garment workers': Loom,
  'Rohingya refugees': Shelter,
  'Domestic workers': Doorway,
  'Social media users': Feed,
  'Teenagers online': Phone,
  'Rural communities': Field,
  'University students': Books,
  'School teachers': Board,
  'STEM learners': Flask,
}

/** One ink per community grouping, so each column reads as its own plate. */
export const COMMUNITY_INK: Record<string, string> = {
  Accessibility: 'text-ink',
  'At-risk Groups': 'text-ink-violet',
  'Digital Society': 'text-ink-blue',
  Education: 'text-brand',
}

export function CommunityMark({ label, className }: { label: string; className?: string }) {
  const Mark = COMMUNITY_MARKS[label]
  return Mark ? <Mark className={className} /> : null
}
