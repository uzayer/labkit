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
