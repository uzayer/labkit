/**
 * Minimal plain-text → Lexical JSON converter for ingested prose (project
 * overviews, bios). One paragraph node per blank-line-separated block — no
 * headings, links, or other rich formatting, since the source data is plain
 * markdown-free prose.
 */
export function textToLexical(text: string) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((paragraph) => ({
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: paragraph,
            version: 1,
          },
        ],
      })),
    },
  }
}
