import { parse, type Creator } from '@retorquere/bibtex-parser'

import { extractDois } from './doi'
import { segmentCitations } from './llm'
import { fetchOrcidWorks } from './orcid'

export interface StagedCandidate {
  key: string
  title: string
  year?: number
  doi?: string
  note?: string
  selected: boolean
  status: 'pending'
  raw?: Record<string, unknown>
}

function creatorFullName(creator: Creator): string | undefined {
  if (creator.name) return creator.name
  const parts = [creator.firstName, creator.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : undefined
}

function splitIntoChunks(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
}

/**
 * Fetch + shape only — no Crossref/OpenAlex enrichment, no DB reads/writes.
 * An ORCID pull is career-wide, not lab-scoped, so no-DOI works are still
 * surfaced (unselected) rather than silently dropped — the dashboard's
 * selection table is where a human narrows this down before anything hits
 * the hydrate phase.
 */
export async function stageOrcidCandidates(orcidId: string): Promise<StagedCandidate[]> {
  const works = await fetchOrcidWorks(orcidId)
  const seenDois = new Set<string>()

  return works.flatMap((work, index): StagedCandidate[] => {
    // Other identifiers ride along on the Candidate for a person reviewing it
    // (and later linking) — Hydration still goes by `doi` alone.
    const raw: Record<string, unknown> = { sourceName: work.sourceName }
    if (work.otherDois.length > 0) raw.otherDois = work.otherDois
    if (work.arxiv) raw.arxiv = work.arxiv
    if (work.pmid) raw.pmid = work.pmid
    if (work.isbn.length > 0) raw.isbn = work.isbn

    if (work.doi) {
      // `work.doi` is already normalized (orcid.ts), so the key, the staged
      // DOI, and the dedupe below all agree on case and prefix.
      // ORCID sometimes lists the same DOI under multiple work-groups (e.g.
      // both self-asserted and Crossref-pushed) — keep the first occurrence.
      if (seenDois.has(work.doi)) return []
      seenDois.add(work.doi)

      return [
        {
          key: `doi:${work.doi}`,
          title: work.title,
          year: work.year,
          doi: work.doi,
          selected: true,
          status: 'pending' as const,
          raw,
        },
      ]
    }

    return [
      {
        key: `orcid:${index}`,
        title: work.title,
        year: work.year,
        note: 'no DOI found — career-wide ORCID result, needs manual review',
        selected: false,
        status: 'pending' as const,
        raw,
      },
    ]
  })
}

/**
 * Parses entries with `@retorquere/bibtex-parser` only — no Crossref
 * reverse-title-lookup here (that's a hydrate-time enrichment step, kept out
 * of staging to stay fast and network-light).
 */
export async function stageBibtexCandidates(bibtexText: string): Promise<StagedCandidate[]> {
  // The parser sentence-cases English titles by default, which lowercases
  // proper nouns ("bangladesh") that no other source will restore.
  const bib = parse(bibtexText, { sentenceCase: false })

  const candidates = bib.entries.map((entry) => {
    const doi = typeof entry.fields.doi === 'string' ? entry.fields.doi : undefined
    const title = typeof entry.fields.title === 'string' ? entry.fields.title : undefined
    const yearRaw = typeof entry.fields.year === 'string' ? parseInt(entry.fields.year, 10) : NaN
    const year = Number.isFinite(yearRaw) ? yearRaw : undefined

    const authorField = Array.isArray(entry.fields.author) ? entry.fields.author : []
    const authors = (authorField as Creator[]).flatMap((creator) => {
      const fullName = creatorFullName(creator)
      return fullName ? [{ fullName }] : []
    })

    // The venue lets a DOI-less entry's Crossref search check venue agreement (crossref-search.ts).
    const venueField = entry.fields.journal ?? entry.fields.booktitle
    const venue = typeof venueField === 'string' ? venueField : undefined
    const raw: Record<string, unknown> = { key: entry.key, type: entry.type, authors, venue }

    if (doi) {
      return {
        key: `bibtex:${entry.key}`,
        title: title ?? entry.key,
        year,
        doi,
        selected: true,
        status: 'pending' as const,
        raw,
      }
    }

    return {
      key: `bibtex:${entry.key}`,
      title: title ?? entry.key,
      year,
      note: 'no DOI found — bibtex entry has no doi field',
      selected: false,
      status: 'pending' as const,
      raw,
    }
  })

  return candidates
}

/**
 * Citation segmentation (Gemini when configured, blank-line split otherwise)
 * + DOI extraction only — no Crossref reverse lookup for DOI-less or
 * ambiguous chunks (that's deferred to the hydrate phase, same reasoning as
 * stageBibtexCandidates).
 */
export async function stageCitationCandidates(citationText: string): Promise<StagedCandidate[]> {
  let chunks = splitIntoChunks(citationText)

  if (process.env.GEMINI_API_KEY?.trim()) {
    try {
      chunks = await segmentCitations(citationText)
    } catch {
      chunks = splitIntoChunks(citationText)
    }
  }

  return chunks.map((chunk, index) => {
    const sourceContext = chunk.length > 80 ? `${chunk.slice(0, 80)}…` : chunk
    const dois = extractDois(chunk)
    const raw: Record<string, unknown> = { chunk }

    if (dois.length === 1) {
      return {
        key: `chunk:${index}`,
        title: sourceContext,
        doi: dois[0],
        selected: true,
        status: 'pending' as const,
        raw,
      }
    }

    if (dois.length > 1) {
      return {
        key: `chunk:${index}`,
        title: sourceContext,
        note: `ambiguous — ${dois.length} DOIs in one chunk: ${dois.join(', ')}`,
        selected: false,
        status: 'pending' as const,
        raw,
      }
    }

    return {
      key: `chunk:${index}`,
      title: sourceContext,
      note: 'no DOI found in chunk — needs Crossref title lookup or manual review',
      selected: false,
      status: 'pending' as const,
      raw,
    }
  })
}
