'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * An image that removes itself (and its frame) when the source fails, rather
 * than showing a broken-image icon. Scraped Google Sites URLs refuse hotlinks,
 * so this is the honest fallback until DIAL's own Media exists.
 */
const OptionalImage = ({
  src,
  alt,
  className,
  frameClassName,
  fallback,
  overlay,
}: {
  src: string
  alt: string
  className?: string
  frameClassName?: string
  /** Drawn in place of the photograph when it fails — usually printed art. */
  fallback?: React.ReactNode
  /**
   * Laid over the photograph, and dropped with it when it fails. Tape belongs
   * here: a photograph is taped down, a printed composition sits flat, so tape
   * rendered as a sibling would survive the fallback and tape a drawing.
   */
  overlay?: React.ReactNode
}) => {
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // A server-rendered <img> can fail before hydration attaches onError.
  useEffect(() => {
    const img = ref.current
    if (img?.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  if (failed) return fallback ?? null
  return (
    <>
      {overlay}
      <div className={cn('overflow-hidden rounded-lg bg-muted', frameClassName)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote placeholder media */}
        <img ref={ref} src={src} alt={alt} onError={() => setFailed(true)} className={cn('w-full object-cover', className)} />
      </div>
    </>
  )
}

export { OptionalImage }
