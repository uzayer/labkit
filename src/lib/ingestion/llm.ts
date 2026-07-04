import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'

import { extractDois } from './doi'

const GEMINI_MODEL = 'gemini-2.5-flash-lite'

const citationSegmentsSchema = z.object({
  citations: z.array(z.string().min(1)).min(1),
})

const citationFieldsSchema = z.object({
  title: z.string().min(1).optional(),
  authors: z.array(z.string().min(1)).optional(),
  year: z.number().int().min(1000).max(2100).optional(),
  venue: z.string().min(1).optional(),
  doi: z.string().min(1).optional(),
})

export interface ExtractedCitationFields {
  title?: string
  authors?: string[]
  year?: number
  venue?: string
}

let client: GoogleGenAI | null = null

function splitIntoChunksFallback(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
}

function getApiKey(): string | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  return apiKey ? apiKey : null
}

function getClient(): GoogleGenAI | null {
  const apiKey = getApiKey()
  if (!apiKey) return null

  client ??= new GoogleGenAI({ apiKey })
  return client
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function sanitizeFieldString(value: string | undefined): string | undefined {
  if (!value) return undefined
  const normalized = normalizeWhitespace(value)
  return normalized.length > 0 ? normalized : undefined
}

function sanitizeAuthors(authors: string[] | undefined): string[] | undefined {
  if (!authors) return undefined

  const normalized = authors
    .map((author) => sanitizeFieldString(author))
    .filter((author): author is string => Boolean(author))

  return normalized.length > 0 ? normalized : undefined
}

function exactSubstringDoi(value: string | undefined, sourceText: string): string | undefined {
  if (!value) return undefined

  const normalized = value.trim()
  return normalized.length > 0 && sourceText.includes(normalized) ? normalized : undefined
}

function parseJson<T>(text: string | undefined, schema: z.ZodType<T>): T | null {
  if (!text) return null

  try {
    const parsed = JSON.parse(text) as unknown
    const result = schema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export async function segmentCitations(text: string): Promise<string[]> {
  const fallback = splitIntoChunksFallback(text)
  const ai = getClient()
  if (!ai) return fallback

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: [
                'Split the following citation paste into individual citations.',
                'Return JSON only with the shape {"citations": string[]}.',
                'Each array item should be one citation string.',
                'You may join wrapped lines and trim whitespace, but do not invent, normalize, or rewrite DOI strings.',
                'Ignore obvious non-citation junk such as isolated page numbers or repeated running headers when they are separate from a citation.',
                '',
                text,
              ].join('\n'),
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          required: ['citations'],
          additionalProperties: false,
          properties: {
            citations: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    })

    const parsed = parseJson(response.text, citationSegmentsSchema)
    if (!parsed) return fallback

    const citations = parsed.citations
      .map((citation) => citation.trim())
      .filter((citation) => citation.length > 0)

    if (citations.length === 0) return fallback

    for (const citation of citations) {
      for (const doi of extractDois(citation)) {
        if (!exactSubstringDoi(doi, text)) {
          return fallback
        }
      }
    }

    return citations
  } catch {
    return fallback
  }
}

export async function extractCitationFields(chunk: string): Promise<ExtractedCitationFields> {
  const ai = getClient()
  if (!ai) return {}

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: [
                'Extract citation metadata from this single citation string.',
                'Return JSON only with the shape {"title"?: string, "authors"?: string[], "year"?: number, "venue"?: string, "doi"?: string}.',
                'Do not guess fields you cannot support from the text. Preserve DOI text exactly if present.',
                '',
                chunk,
              ].join('\n'),
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            authors: {
              type: 'array',
              items: { type: 'string' },
            },
            year: { type: 'integer' },
            venue: { type: 'string' },
            doi: { type: 'string' },
          },
        },
      },
    })

    const parsed = parseJson(response.text, citationFieldsSchema)
    if (!parsed) return {}

    exactSubstringDoi(parsed.doi, chunk)

    const fields: ExtractedCitationFields = {}
    const title = sanitizeFieldString(parsed.title)
    const authors = sanitizeAuthors(parsed.authors)
    const venue = sanitizeFieldString(parsed.venue)

    if (title) fields.title = title
    if (authors) fields.authors = authors
    if (parsed.year) fields.year = parsed.year
    if (venue) fields.venue = venue

    return fields
  } catch {
    return {}
  }
}
