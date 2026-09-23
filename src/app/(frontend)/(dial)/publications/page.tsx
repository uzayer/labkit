import { Suspense } from 'react'
import { ArrowUpRight } from 'lucide-react'

import { PersonFace } from '@/components/dial/person-chip'
import { ScrollRuler } from '@/components/dial/scroll-ruler'
import { FaqSection } from '@/components/dial/faq-section'
import { PageHeader } from '@/components/dial/page-header'
import { PublicationsSectionWithUrl } from '@/components/dial/publications1'
import { publicationFaqs } from '@/lib/dial/data/faqs'
import { label } from '@/lib/dial/typography'
import { getDial } from '@/lib/dial/data/get'

// Scholar profiles the NSU publications page links to, in its order
// (nsu-hci-current-website/publications.md — "Google Scholar").
// Team Member slugs.
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

export default async function PublicationsPage() {
  const { team, publicationsByYear, highlightAuthors, toPublicationYears } = await getDial()
  const yearGroups = toPublicationYears(publicationsByYear())
  const years = yearGroups.map((g) => Number(g.year)).filter(Number.isFinite)
  const firstYear = Math.min(...years)
  const lastYear = Math.max(...years)
  const publicationCount = yearGroups.reduce((n, g) => n + g.publications.length, 0)
  const scholarLinks = SCHOLAR_ORDER.flatMap((slug) => {
    const member = team.find((m) => m.slug === slug)
    const url = member?.socials?.find((s) => s.platform === 'google-scholar')?.url
    return member && url ? [{ name: member.name, slug: member.slug, photo: member.photo, url }] : []
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
          ...(years.length > 0 ? [{ value: `${firstYear}–${lastYear}`, label: 'Years' }] : []),
        ]}
      >
        {/* The Lab's own people, as people: a face (or their printed initial)
            and a name per profile, each leaving the site for Scholar. A run of
            comma-separated underlined names read as one more line of the lede;
            as chips they read as a set of doors, and the outward arrow says
            where each one goes. */}
        {scholarLinks.length > 0 && (
          <div className="mt-8">
            <p className={label}>On Google Scholar</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {scholarLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group ease-snappy hover:text-brand inline-flex items-center gap-1.5 rounded-full bg-secondary py-0.5 pr-2.5 pl-0.5 text-sm text-secondary-foreground transition-[color,scale] duration-150 active:scale-[0.97]"
                  >
                    <PersonFace name={link.name} seed={link.slug} photo={link.photo} size="sm" />
                    {link.name}
                    <ArrowUpRight className="ease-snappy size-3.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-current" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PageHeader>
      <FaqSection items={publicationFaqs} title="Working with this list" className="pt-0 md:pt-0" />

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
