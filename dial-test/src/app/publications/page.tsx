import { Suspense } from 'react'
import { ScrollRuler } from '@/components/scroll-ruler'
import { FaqSection } from '@/components/faq-section'
import { PageHeader } from '@/components/page-header'
import { PublicationsSectionWithUrl } from '@/components/publications1'
import { publicationsByYear, team } from '@/data'
import { publicationFaqs } from '@/data/faqs'
import { highlightAuthors, toPublicationYears } from '@/data/views'

// Scholar profiles the NSU publications page links to, in its order
// (nsu-hci-current-website/publications.md — "Google Scholar").
const SCHOLAR_ORDER = [
  'nova-ahmed',
  'tamanna-motahar',
  'rahat-jahangir-rony',
  'anik-saha',
  'anik-sinha',
  'ifti-azad-abeer',
]

export const metadata = {
  title: 'Publications',
  description: 'Publications from the Design Inclusion and Access Lab at North South University.',
}

export default function PublicationsPage() {
  const yearGroups = toPublicationYears(publicationsByYear())
  const years = yearGroups.map((g) => Number(g.year)).filter(Number.isFinite)
  const firstYear = Math.min(...years)
  const lastYear = Math.max(...years)
  const publicationCount = yearGroups.reduce((n, g) => n + g.publications.length, 0)
  const scholarLinks = SCHOLAR_ORDER.flatMap((id) => {
    const member = team.find((m) => m.id === id)
    const url = member?.socials?.find((s) => s.platform === 'google-scholar')?.url
    return member && url ? [{ name: member.name, url }] : []
  })
  return (
    <>
      <PageHeader
        eyebrow="Research"
        art="strata"
        title="Publications"
        description="Peer-reviewed papers, extended abstracts, and preprints from DIAL, with links to each paper and its citation."
        facts={[
          { value: String(publicationCount), label: 'Publications' },
          { value: `${firstYear}–${lastYear}`, label: 'Years' },
        ]}
      >
        <p className="mt-8 text-sm text-muted-foreground">
          On Google Scholar:{' '}
          {scholarLinks.map((link, i) => (
            <span key={link.url}>
              {i > 0 && ', '}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
              >
                {link.name}
              </a>
            </span>
          ))}
        </p>
      </PageHeader>
      <FaqSection items={publicationFaqs} title="Working with this list" />

      <ScrollRuler />

      <Suspense>
        <PublicationsSectionWithUrl
          yearGroups={yearGroups}
          highlightAuthors={highlightAuthors()}
          heading={null}
        />
      </Suspense>
    </>
  )
}
