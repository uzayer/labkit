/**
 * Checks if a string is a valid HTTP/HTTPS (or mailto) URL.
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:'
    )
  } catch {
    return false
  }
}

const SAFE_HTTP_PROTOCOLS = new Set(['http:', 'https:'])
const ALLOWED_EMBED_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com',
])
const DIRECT_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v']
const SAFE_COLOR_PATTERN =
  /^(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\([^<>{}\n\r;]+\)|oklch\([^<>{}\n\r;]+\)|oklab\([^<>{}\n\r;]+\)|transparent|currentColor|black|white)$/i
const SAFE_CSS_LENGTH_PATTERN = /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw|svh|svw|lvh|lvw)$/

function parseSafeUrl(url: string): URL | null {
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (!SAFE_HTTP_PROTOCOLS.has(parsed.protocol)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function isDirectVideoUrl(parsed: URL): boolean {
  return DIRECT_VIDEO_EXTENSIONS.some((extension) =>
    parsed.pathname.toLowerCase().endsWith(extension),
  )
}

export function isSafeHttpUrl(url: string): boolean {
  return Boolean(parseSafeUrl(url))
}

export function isValidExternalHttpUrl(url: string): boolean {
  return isSafeHttpUrl(url)
}

export function isValidPresentationVideoUrl(url: string): boolean {
  const parsed = parseSafeUrl(url)

  if (!parsed) return false

  return ALLOWED_EMBED_HOSTS.has(parsed.hostname) || isDirectVideoUrl(parsed)
}

export function getSafePresentationVideoSource(
  url: string | null | undefined,
): { src: string; type: 'embed' | 'file' } | null {
  if (!url) return null

  const parsed = parseSafeUrl(url)

  if (!parsed) return null

  if (isDirectVideoUrl(parsed)) {
    return {
      src: parsed.toString(),
      type: 'file',
    }
  }

  const hostname = parsed.hostname.toLowerCase()

  if (hostname === 'youtu.be') {
    const videoId = parsed.pathname.split('/').filter(Boolean)[0]

    if (!videoId) return null

    return {
      src: `https://www.youtube.com/embed/${videoId}`,
      type: 'embed',
    }
  }

  if (hostname.endsWith('youtube.com')) {
    if (parsed.pathname.startsWith('/embed/')) {
      return {
        src: parsed.toString(),
        type: 'embed',
      }
    }

    const videoId = parsed.searchParams.get('v')

    if (!videoId) return null

    return {
      src: `https://www.youtube.com/embed/${videoId}`,
      type: 'embed',
    }
  }

  if (hostname === 'player.vimeo.com') {
    return {
      src: parsed.toString(),
      type: 'embed',
    }
  }

  if (hostname.endsWith('vimeo.com')) {
    const videoId = parsed.pathname.split('/').filter(Boolean)[0]

    if (!videoId || !/^\d+$/.test(videoId)) return null

    return {
      src: `https://player.vimeo.com/video/${videoId}`,
      type: 'embed',
    }
  }

  return null
}

export function sanitizeThemeColorValue(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  return SAFE_COLOR_PATTERN.test(trimmed) ? trimmed : null
}

export function sanitizeThemeRadiusValue(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  return SAFE_CSS_LENGTH_PATTERN.test(trimmed) ? trimmed : null
}

/**
 * Checks if a Payload Lexical rich text field has meaningful content.
 * Traverses the editor state tree to find non-empty text nodes.
 */
export function isRichTextEmpty(richText: any): boolean {
  if (!richText || !richText.root || !Array.isArray(richText.root.children)) {
    return true
  }

  function hasText(nodes: any[]): boolean {
    for (const node of nodes) {
      if (
        node &&
        node.type === 'text' &&
        typeof node.text === 'string' &&
        node.text.trim().length > 0
      ) {
        return true
      }
      if (node && Array.isArray(node.children) && hasText(node.children)) {
        return true
      }
    }
    return false
  }

  return !hasText(richText.root.children)
}
