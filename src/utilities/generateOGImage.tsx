import { ImageResponse } from 'next/og'
import { loadGoogleFont } from './loadGoogleFont'
import { getCachedGlobal } from './getGlobals'
import { DataFromGlobalSlug } from 'payload'
import { Media } from '@/payload-types'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import localization from '@/localization.config'

/**
 * Type guard to check if a value is a Media object
 */
function isMedia(value: unknown): value is Media {
  return (
    typeof value === 'object' &&
    value !== null &&
    'url' in value &&
    typeof (value as Media).url === 'string'
  )
}

/**
 * Type guard to check if backgroundImage is localized
 */
function isLocalizedMedia(
  value: unknown,
): value is { en?: Media | string | null; de?: Media | string | null } {
  return typeof value === 'object' && value !== null && ('en' in value || 'de' in value)
}

/**
 * OG Image generation. PayloadCMS can'T be run on edge routes, so prevent setting the open graph routes to edge.
 * We are reading the default OG Image from the public directory
 */

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

/**
 * Generates an Open Graph image with a background image and title.
 *
 * The background image is loaded from the public directory.
 * The title is rendered with the font 'Inter', loaded from Google Fonts.
 *
 * @param {Object} options - Options for generating the image
 * @param {string} [options.title] - Title to render on the image. Defaults to "Payblocks".
 * @returns {Promise<ImageResponse>} - A promise that resolves to an `ImageResponse` object.
 */
export default async function generateOGImage({
  title,
  locale,
}: {
  title?: string | null
  locale?: string | null
}) {
  const pageConfig = (await getCachedGlobal(
    'page-config',
    'all',
    3,
  )()) as DataFromGlobalSlug<'page-config'>

  const currentLocale = locale || localization.defaultLocale

  // Extract the localized background image
  let backgroundImageUrl: string | null = null
  const bgImage = pageConfig.openGraph?.backgroundImage

  if (isLocalizedMedia(bgImage)) {
    const localizedImage = bgImage[currentLocale]
    if (isMedia(localizedImage)) {
      backgroundImageUrl = localizedImage.url ?? null
    } else if (typeof localizedImage === 'string') {
      backgroundImageUrl = localizedImage
    }
  }

  // Extract the localized page title
  const defaultMeta = pageConfig.defaultMeta as any
  const pageTitle = title || defaultMeta?.[currentLocale]?.title || 'Payblocks'

  const textColor = pageConfig.openGraph?.textColor

  if (!backgroundImageUrl) {
    return new Response('No background image found', { status: 404 })
  }

  if (!textColor) {
    return new Response('No text color found', { status: 404 })
  }

  // Only prepend server URL if the image URL is relative (doesn't start with http:// or https://)
  const backgroundImage = backgroundImageUrl.startsWith('http')
    ? backgroundImageUrl
    : `${NEXT_PUBLIC_SERVER_URL}${backgroundImageUrl}`

  try {
    // Load the font
    const fontData = await loadGoogleFont('Inter', pageTitle)

    return new ImageResponse(
      (
        <div
          style={{
            background: '#fff',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          {/* Background image */}
          <img
            src={backgroundImage}
            alt="Background"
            width={size.width}
            height={size.height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Title container with fixed height */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px',
              maxWidth: '70%',
              minHeight: '200px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                lineHeight: '1.4',
                fontWeight: '600',
                color: textColor,
                textAlign: 'left',
                margin: '0',
                fontFamily: 'Inter',
              }}
            >
              {pageTitle}
            </h1>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            style: 'normal',
          },
        ],
      },
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
