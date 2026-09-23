'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { label as labelType } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

export interface PartnerStripEntry {
  name: string
  /** Nullable because the Organization records this is fed carry it that way. */
  shortName?: string | null
  url?: string | null
  logo?: { src: string; width: number; height: number } | null
}

/**
 * How many partners show at once, by screen: two on a phone, three on a
 * tablet, and every one of them from `lg`, where the row has room for the lot
 * and nothing needs to rotate.
 */
const SLOTS_SM = 2
const SLOTS_MD = 3
/** One slot swaps at a time, so the strip never flickers as a whole. */
const SWAP_MS = 2200

/** Long institutional names get their short form; everything else is spelled out. */
const wordmark = (partner: PartnerStripEntry) =>
  partner.name.length > 26 ? (partner.shortName ?? partner.name) : partner.name

const wordmarkType = 'font-display text-base leading-snug tracking-tight md:text-lg'

/**
 * Logos are sized to a common area rather than a common height, so a square
 * crest and a long wordmark read at the same weight: at one height the crest
 * looms and the wordmark shrinks to a thread. Clamped so neither extreme runs
 * away. In px; a 3:1 mark lands at 32px tall.
 */
const LOGO_AREA = 3072
const LOGO_MIN_H = 18
const LOGO_MAX_H = 48

const logoHeight = ({ width, height }: { width: number; height: number }) =>
  Math.round(Math.min(LOGO_MAX_H, Math.max(LOGO_MIN_H, Math.sqrt(LOGO_AREA / (width / height)))))

/**
 * The collaborators line, as each organization's own logo. The marks arrive in
 * every palette there is (a red block, a four-colour wordmark, navy type), so
 * they are set in greyscale at reduced strength to sit on the page as one row,
 * and take their colour back on hover. A partner with no logo on record falls
 * back to its name set as a wordmark.
 *
 * Below `lg`, partners are dealt round-robin into a few slots and each slot
 * cycles its own share, so the strip stays one line at any count. Each variant
 * is rendered and the breakpoint picks one with CSS, so the server-rendered
 * page already shows the right count with no swap on hydration. The logos sit
 * at a fixed gap from one another rather than spread across equal columns,
 * which on a wide screen left them stranded far apart. With reduced motion
 * every partner prints at once.
 *
 * Mechanic adapted from Tailark's logo-cloud-2.
 */
const PartnerStrip = ({
  label,
  partners,
  className,
}: {
  label: string
  partners: PartnerStripEntry[]
  className?: string
}) => {
  const reduceMotion = useReducedMotion()
  const [turn, setTurn] = useState(0)

  const rotates = !reduceMotion && partners.length > SLOTS_SM

  useEffect(() => {
    if (!rotates) return
    const id = setInterval(() => setTurn((t) => t + 1), SWAP_MS)
    return () => clearInterval(id)
  }, [rotates])

  if (partners.length === 0) return null

  const all = (
    <ul className={cn(rowClass, rotates && 'max-lg:hidden')}>
      {partners.map((partner) => (
        <li key={partner.name}>
          <Wordmark partner={partner} />
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <p className={labelType}>{label}</p>
      {rotates && (
        <>
          <RotatingRow partners={partners} count={SLOTS_SM} turn={turn} className="sm:hidden" />
          <RotatingRow
            partners={partners}
            count={SLOTS_MD}
            turn={turn}
            className="max-sm:hidden lg:hidden"
          />
        </>
      )}
      {all}
    </div>
  )
}

const rowClass = 'flex flex-wrap items-center gap-x-10 gap-y-6 md:gap-x-14'

const RotatingRow = ({
  partners,
  count,
  turn,
  className,
}: {
  partners: PartnerStripEntry[]
  count: number
  turn: number
  className?: string
}) => {
  // Round-robin rather than consecutive chunks: adding a seventh partner then
  // lengthens a slot instead of reshuffling which name sits where.
  const slots: PartnerStripEntry[][] = Array.from(
    { length: Math.min(count, partners.length) },
    () => [],
  )
  partners.forEach((partner, i) => slots[i % slots.length].push(partner))

  return (
    <ul className={cn(rowClass, 'flex-nowrap', className)}>
      {slots.map((slot, i) => (
        // The slot turns over only on its own beat: one slot advances per
        // tick, so each name holds for (slots × SWAP_MS) and every slot is
        // still showing its first name on the first paint.
        <PartnerSlot
          key={i}
          partners={slot}
          step={Math.floor((turn - i + slots.length - 1) / slots.length)}
        />
      ))}
    </ul>
  )
}

const PartnerSlot = ({ partners, step }: { partners: PartnerStripEntry[]; step: number }) => {
  const partner = partners[((step % partners.length) + partners.length) % partners.length]

  return (
    // Every partner the slot can show is laid in the same grid cell, unseen,
    // so the slot is as wide as its widest logo and as tall as its tallest,
    // and a swap never nudges its neighbours.
    <li className="relative grid items-center">
      {partners.map((p) => (
        <span key={p.name} className="invisible [grid-area:1/1]">
          <Wordmark partner={p} />
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={partner.name}
          initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center"
        >
          <Wordmark partner={partner} />
        </motion.span>
      </AnimatePresence>
    </li>
  )
}

const Wordmark = ({ partner }: { partner: PartnerStripEntry }) => {
  const mark = partner.logo ? (
    // eslint-disable-next-line @next/next/no-img-element -- static SVGs; next/image adds nothing here
    <img
      src={partner.logo.src}
      alt={partner.name}
      width={Math.round((logoHeight(partner.logo) * partner.logo.width) / partner.logo.height)}
      height={logoHeight(partner.logo)}
      loading="lazy"
      decoding="async"
      // Inverted in dark mode so dark type stays legible; there the colour
      // never comes back, since an inverted colour would be the wrong one.
      className="ease-snappy block max-w-full object-contain object-left opacity-60 grayscale transition-[opacity,filter] duration-200 group-hover:opacity-100 group-hover:grayscale-0 dark:invert dark:group-hover:grayscale"
    />
  ) : (
    <span
      className={cn(
        wordmarkType,
        'text-foreground/75 transition-colors group-hover:text-foreground',
      )}
    >
      {wordmark(partner)}
    </span>
  )

  return partner.url ? (
    <a href={partner.url} target="_blank" rel="noreferrer" className="group" title={partner.name}>
      {mark}
    </a>
  ) : (
    <span className="group" title={partner.name}>
      {mark}
    </span>
  )
}

export { PartnerStrip }
