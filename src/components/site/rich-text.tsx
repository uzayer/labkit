import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/utils'

/**
 * A rich text field (a bio, the About page) set as prose. Renders nothing for
 * an empty field, so callers can fall back to something else.
 */
export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!hasContent(data)) return null
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      className={cn(
        'prose max-w-prose prose-neutral md:prose-lg dark:prose-invert',
        'prose-headings:font-display prose-headings:font-normal prose-a:underline-offset-4',
        className,
      )}
    />
  )
}

interface LexicalNode {
  text?: string
  children?: LexicalNode[]
  type?: string
}

const nodeHasContent = (node: LexicalNode): boolean =>
  Boolean(node.text?.trim()) ||
  (node.type !== undefined && !['paragraph', 'text', 'linebreak'].includes(node.type)) ||
  (node.children ?? []).some(nodeHasContent)

/** False for a missing field and for one the editor saved as a lone empty paragraph. */
export function hasContent(data: unknown): boolean {
  const root = (data as { root?: LexicalNode } | null | undefined)?.root
  return Boolean(root && (root.children ?? []).some(nodeHasContent))
}
