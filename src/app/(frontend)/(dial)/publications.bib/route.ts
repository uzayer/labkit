import { getDial } from '@/lib/dial/data/get'

/**
 * Every DIAL publication as one BibTeX file, newest first: what a researcher
 * wants when they are about to cite several of the Lab's papers, or keep them
 * in Zotero. The same generated entries the Cite popovers show, with keys that
 * are unique across the file.
 */
export async function GET() {
  const { publicationsByYear, citationsFor, labInfo } = await getDial()
  const entries = publicationsByYear().map((pub) => citationsFor(pub).bibtex)
  const header = `% ${labInfo.name} (${labInfo.shortName}) publications, generated ${new Date().toISOString().slice(0, 10)}\n\n`
  const filename = `${labInfo.shortName.toLowerCase()}-publications.bib`

  return new Response(header + entries.join('\n\n') + '\n', {
    headers: {
      'Content-Type': 'application/x-bibtex; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
