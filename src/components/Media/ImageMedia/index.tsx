'use client'

import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

import cssVariables from '@/cssVariables'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

const { breakpoints } = cssVariables

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string | null = srcFromProps || null

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      filename: fullFilename,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource

    /**
     * Support both absolute and relative media URLs. When using the storage adapter with "disablePayloadAccessControl" you
     * get absolute URLs. Otherwise, we get a relative URL that needs to be prefixed to work with next/image
     */
    if (url && url.startsWith('/')) {
      src = `${NEXT_PUBLIC_SERVER_URL}${url}`
    } else {
      src = url || null
    }
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value}px`)
        .join(', ')

  return (
    <>
      {src && (
        <NextImage
          alt={alt || ''}
          className={cn(imgClassName)}
          fill={fill}
          height={!fill ? height : undefined}
          onClick={onClick}
          onLoad={() => {
            setIsLoading(false)
            if (typeof onLoadFromProps === 'function') {
              onLoadFromProps()
            }
          }}
          priority={priority}
          quality={90}
          sizes={sizes}
          src={src}
          width={!fill ? width : undefined}
        />
      )}
    </>
  )
}
