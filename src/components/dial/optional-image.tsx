'use client'

import { getImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/** Matches the Media originals' own WebP quality; listed in next.config.ts. */
const QUALITY = 80

/**
 * `src`, `srcSet` and `sizes` for a resized copy of a Media file. SVGs and
 * remote URLs are returned as they are: an SVG has nothing to resize, and the
 * optimizer only accepts this site's own paths.
 *
 * A number is a fixed rendered width in CSS pixels, answered with 1x/2x/3x
 * candidates: a list page prints hundreds of faces, and the full width ladder
 * Next generates for a `sizes` string grew its markup by a third. A string is
 * an `<img sizes>` value, for an image whose width follows the layout.
 */
function responsiveSource(src: string, sizes: number | string) {
  if (!src.startsWith('/') || src.endsWith('.svg')) return null
  if (typeof sizes === 'string') {
    const { props } = getImageProps({ src, alt: '', fill: true, sizes, quality: QUALITY })
    return { src: props.src, srcSet: props.srcSet, sizes: props.sizes }
  }
  // Next's fixed-width candidates stop at 2x; the 2x candidate of an image
  // half as wide again is the 3x one.
  const fixed = (width: number) =>
    getImageProps({ src, alt: '', width, height: width, quality: QUALITY }).props
  const base = fixed(sizes)
  const triple = fixed(Math.ceil(sizes * 1.5))
  return { src: base.src, srcSet: `${base.srcSet}, ${triple.src} 3x`, sizes: undefined }
}

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
  priority = false,
  sizes,
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
  /**
   * Load eagerly at high priority. Only for a photograph in the first
   * viewport; everything else is lazy so it stays off the critical path.
   */
  priority?: boolean
  /**
   * The rendered width: CSS pixels for a fixed-size frame, or an `<img sizes>`
   * value. Given it, the browser picks a resized copy from Next's image
   * optimizer instead of downloading the original Media file, which is up to
   * 2048px for a 24px face. Same element, same CSS and crop, so it looks the
   * same; only the bytes change. Leave it out where the frame takes its width
   * from the image (`w-fit`): a `srcSet` changes the image's intrinsic size.
   */
  sizes?: number | string
}) => {
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // A server-rendered <img> can fail before hydration attaches onError. A lazy
  // image that has not started loading has no currentSrc, so it is not a failure.
  useEffect(() => {
    const img = ref.current
    if (img?.complete && img.currentSrc && img.naturalWidth === 0) setFailed(true)
  }, [])

  if (failed) return fallback ?? null
  const responsive = sizes ? responsiveSource(src, sizes) : null
  return (
    <>
      {overlay}
      <div className={cn('overflow-hidden rounded-lg bg-muted', frameClassName)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote placeholder media */}
        <img
          ref={ref}
          src={responsive?.src ?? src}
          srcSet={responsive?.srcSet}
          sizes={responsive?.sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('w-full object-cover', className)}
        />
      </div>
    </>
  )
}

export { OptionalImage }
