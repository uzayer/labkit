import { getDial } from '@/lib/dial/data/get'

/**
 * A paper's generated citations (ACM, APA, BibTeX) as JSON, for the Cite
 * popover on list rows. The list does not ship them: 190 papers of three
 * formatted references each would outweigh the rest of the page, and most
 * rows are never cited. The paper's own page renders them inline instead.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { getPublication, citationsFor } = await getDial()
  const pub = getPublication(id)
  if (!pub) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(citationsFor(pub))
}
