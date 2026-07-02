import fs from 'node:fs'
import matter from 'gray-matter'

/**
 * DIAL's curated data files come in two shapes:
 *
 * - "frontmatter-only": grants/*.md, projects/*.md, publications/*.md, and
 *   slugged team files (team/faculty/*.md, team/researchers/*.md) — the
 *   frontmatter block IS the record; the body is markdown prose (a bio or
 *   overview paragraph).
 * - "YAML body": _reference/*.md, roster team files (alumni, collaborators,
 *   graduate-ras, undergraduate-ras), and awards/awards.md — the frontmatter
 *   is just a couple of metadata keys, and the real list lives in the body
 *   as YAML, not markdown. Reading it means re-wrapping the body in its own
 *   frontmatter fence and parsing again.
 */

export function readFrontmatter(filePath: string): Record<string, unknown> {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return matter(raw).data
}

export function readFrontmatterWithBody(filePath: string): {
  frontmatter: Record<string, unknown>
  body: string
} {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data, body: content.trim() }
}

export function readYamlBody(filePath: string): Record<string, unknown> {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(raw)
  return matter(`---\n${content}\n---`).data
}

export function listMarkdownFiles(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => `${dir}/${entry.name}`)
    .sort()
}
