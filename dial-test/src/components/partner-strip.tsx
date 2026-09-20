'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { label as labelType } from '@/lib/typography'
import { cn } from '@/lib/utils'

export interface PartnerStripEntry {
  name: string
  /** Nullable because the Organization records this is fed carry it that way. */
  shortName?: string | null
  url?: string | null
}

/** How many partners share one slot before the strip needs another column. */
const SLOTS = 3
/** One slot swaps at a time, so the strip never flickers as a whole. */
const SWAP_MS = 2200

/** Long institutional names get their short form; everything else is spelled out. */
const wordmark = (partner: PartnerStripEntry) =>
  partner.name.length > 26 ? (partner.shortName ?? partner.name) : partner.name

/** Shared by the visible name and the invisible one holding its row open. */
const wordmarkType = 'font-display text-base leading-snug tracking-tight md:text-lg'

/**
 * The collaborators line, set as wordmarks rather than a row of institutional
 * logos — DIAL has no permission to reproduce six universities' marks, and a
 * wordmark strip is what the lab's own identity is already made of.
 *
 * Partners are dealt round-robin into a fixed number of slots, and each slot
 * cycles its own share, so the strip stays one line wide at any count and on
 * any screen. With reduced motion every name prints at once.
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

  // Round-robin rather than consecutive chunks: adding a seventh partner then
  // lengthens a slot instead of reshuffling which name sits where.
  const slots: PartnerStripEntry[][] = Array.from({ length: Math.min(SLOTS, partners.length) }, () => [])
  partners.forEach((partner, i) => slots[i % slots.length].push(partner))

  const rotates = !reduceMotion && slots.some((slot) => slot.length > 1)

  useEffect(() => {
    if (!rotates) return
    const id = setInterval(() => setTurn((t) => t + 1), SWAP_MS)
    return () => clearInterval(id)
  }, [rotates])

  if (partners.length === 0) return null

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <p className={labelType}>{label}</p>
      {rotates ? (
        <ul className="grid grid-cols-1 gap-y-2.5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0">
          {slots.map((slot, i) => (
            // The slot turns over only on its own beat: one slot advances per
            // tick, so a three-slot strip swaps each name every ~6.6s and every
            // slot is still showing its first name on the first paint.
            <PartnerSlot
              key={i}
              partners={slot}
              step={Math.floor((turn - i + slots.length - 1) / slots.length)}
            />
          ))}
        </ul>
      ) : (
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {partners.map((partner) => (
            <li key={partner.name}>
              <Wordmark partner={partner} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const PartnerSlot = ({ partners, step }: { partners: PartnerStripEntry[]; step: number }) => {
  const partner = partners[((step % partners.length) + partners.length) % partners.length]

  return (
    <li className="relative">
      {/* Holds the row open at the widest name the slot can show — including
          however many lines it wraps to — so a swap never nudges the rows
          either side of it. */}
      <span aria-hidden className={cn(wordmarkType, 'invisible block')}>
        {wordmark(partners.reduce((a, b) => (wordmark(b).length > wordmark(a).length ? b : a)))}
      </span>
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
  const text = wordmark(partner)
  const className = cn(wordmarkType, 'text-foreground/75 transition-colors')

  return partner.url ? (
    <a
      href={partner.url}
      target="_blank"
      rel="noreferrer"
      className={cn(className, 'hover:text-foreground')}
      title={partner.name}
    >
      {text}
    </a>
  ) : (
    <span className={className} title={partner.name}>
      {text}
    </span>
  )
}

export { PartnerStrip }
