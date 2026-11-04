const DOI_PATTERN = /10\.\d{4,9}\/[^\s"'<>]+/gi

function trimTrailingPunctuation(doi: string): string {
  return doi.replace(/[.,;:)\]}]+$/g, '')
}

export function extractDois(text: string): string[] {
  const matches = text.match(DOI_PATTERN) ?? []
  const seen = new Set<string>()
  const dois: string[] = []

  for (const match of matches) {
    const doi = trimTrailingPunctuation(match)
    if (!doi || seen.has(doi)) continue
    seen.add(doi)
    dois.push(doi)
  }

  return dois
}
