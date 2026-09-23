import { Check, X } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Pieces for the design system and guidelines page: a specimen that explains itself when
 * you look closer, a curve you can watch run, and a Do/Don't pair.
 *
 * No JavaScript. The note is in the markup from the start — the specimen's
 * accessible description — and CSS decides when to show it: on hover or
 * keyboard focus where there is a pointer, and always on a touch screen,
 * which has no hover to reveal it with. So nothing on the page is a secret
 * kept from a phone.
 */

/** Shown only where the device can hover; everywhere else the note sits open. */
const revealOnHover =
  '[@media(hover:hover)_and_(pointer:fine)]:pointer-events-none [@media(hover:hover)_and_(pointer:fine)]:absolute [@media(hover:hover)_and_(pointer:fine)]:inset-x-3 [@media(hover:hover)_and_(pointer:fine)]:bottom-3 [@media(hover:hover)_and_(pointer:fine)]:translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/specimen:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/specimen:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-focus-visible/specimen:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:group-focus-visible/specimen:opacity-100 motion-reduce:translate-y-0'

/**
 * A specimen on a card with its note pinned to it: the token, its value, and
 * the rule for using it. The note slides up over the foot of the card when the
 * pointer arrives (200ms, the site's snappy curve), and sits printed in the
 * foot of the card on touch screens.
 *
 * The card is focusable only to reveal the note — it is not a control — so it
 * says so to assistive tech through `aria-describedby`, not a role.
 */
export function Annotated({
  id,
  name,
  token,
  value,
  rule,
  dont,
  children,
  className,
  stageClassName,
}: {
  /** Unique on the page; ties the card to its note. */
  id: string
  name: string
  /** The code a developer reaches for: a class, a component, a variable. */
  token?: string
  /** A literal value, or a live one (`TokenValue`). */
  value?: React.ReactNode
  rule: string
  /** The misuse to avoid, where there is a tempting one. */
  dont?: string
  children: React.ReactNode
  className?: string
  stageClassName?: string
}) {
  const noteId = `note-${id}`
  return (
    <figure className={cn('flex flex-col', className)}>
      <div
        tabIndex={0}
        aria-describedby={noteId}
        className={cn(
          'group/specimen relative overflow-hidden rounded-lg border border-border bg-card outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
          stageClassName,
        )}
      >
        {children}
        <div
          id={noteId}
          className={cn(
            'ease-snappy z-10 rounded-md border border-border bg-popover/95 p-3 text-left shadow-[0_8px_24px_-16px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-[opacity,translate] duration-200',
            // Touch: printed as a slip inside the foot of the card.
            'm-3 [@media(hover:hover)_and_(pointer:fine)]:m-0',
            revealOnHover,
          )}
        >
          {(token || value) && (
            <p className="flex flex-wrap items-baseline justify-between gap-x-3 font-mono text-[11px] text-foreground">
              {token && <span>{token}</span>}
              {value && <span className="text-muted-foreground">{value}</span>}
            </p>
          )}
          <p className="mt-1 text-xs text-pretty text-muted-foreground">{rule}</p>
          {dont && (
            <p className="mt-1.5 flex gap-1.5 text-xs text-pretty text-muted-foreground">
              <X aria-hidden className="mt-px size-3.5 shrink-0 text-destructive" />
              <span>
                <span className="sr-only">Don&rsquo;t: </span>
                {dont}
              </span>
            </p>
          )}
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-xs text-foreground">{name}</figcaption>
    </figure>
  )
}

/**
 * An easing curve, drawn and run. The plot is the curve itself (x is time, y
 * is progress); hovering or focusing the row (a tap, on a phone) fills a track
 * with that timing, so the difference between "snappy" and "deliberate" is
 * felt, not read off four numbers. A scaleX fill — transform only — and under
 * reduced motion it arrives without the travel.
 */
export function EaseDemo({
  token,
  value,
  use,
  duration,
}: {
  token: string
  /** `cubic-bezier(x1, y1, x2, y2)`. */
  value: string
  use: string
  /** How long the demo runs, in ms: the duration the curve is used at. */
  duration: number
}) {
  const [x1, y1, x2, y2] = value.match(/-?[\d.]+/g)!.map(Number)
  // A 64×64 plot, y flipped so progress rises.
  const p = (x: number, y: number) => `${4 + x * 56} ${60 - y * 56}`
  return (
    <li
      tabIndex={0}
      className="group/ease grid grid-cols-[4.5rem_1fr] items-center gap-5 py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <svg aria-hidden viewBox="0 0 64 64" className="text-ink size-18">
        <path d="M4 60h56M4 60V4" className="stroke-border" fill="none" strokeWidth={1} />
        <path
          d={`M${p(0, 0)} C${p(x1, y1)} ${p(x2, y2)} ${p(1, 1)}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-sm">{token}</span>
          <span className="font-mono text-[11px] text-muted-foreground">{value}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{use}</p>
        {/* The track fills with the curve's timing on hover or focus, and runs
            back at the same pace when the pointer leaves. */}
        <div aria-hidden className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <span
            className="bg-ink absolute inset-0 origin-left scale-x-[0.04] rounded-full transition-transform group-hover/ease:scale-x-100 group-focus-visible/ease:scale-x-100 motion-reduce:transition-none"
            style={
              {
                transitionTimingFunction: value,
                transitionDuration: `${duration}ms`,
              } as React.CSSProperties
            }
          />
        </div>
        <p className="mt-1.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          Hover or tap to run · {duration}ms
        </p>
      </div>
    </li>
  )
}

/**
 * A Do and a Don't, side by side, for the rules that are easy to break
 * because the wrong version looks fine at a glance.
 */
export function DoDont({
  rule,
  why,
  dont,
  doThis,
}: {
  rule: string
  why: string
  dont: React.ReactNode
  doThis: React.ReactNode
}) {
  return (
    <div className="border-t border-border pt-6">
      <p className="font-display text-xl leading-snug">{rule}</p>
      <p className="mt-1 max-w-prose text-sm text-pretty text-muted-foreground">{why}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Verdict ok={false}>{dont}</Verdict>
        <Verdict ok>{doThis}</Verdict>
      </div>
    </div>
  )
}

function Verdict({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  const Icon = ok ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border bg-card',
        ok ? 'border-brand/40' : 'border-destructive/30',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-1.5 border-b px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase',
          ok ? 'border-brand/25 text-brand' : 'border-destructive/20 text-destructive',
        )}
      >
        <Icon aria-hidden className="size-3.5" />
        {ok ? 'Do' : "Don't"}
      </p>
      <div className="grid min-h-32 flex-1 place-items-center px-5 py-6">{children}</div>
    </div>
  )
}
