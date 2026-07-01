import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { ThemeCollaborators, ThemeRelatedAreas } from '@/components/theme-page-sections'
import { Separator } from '@/components/ui/separator'

import { Feature295, type ResearchProject } from '@/components/feature295'
import { Hero262 } from '@/components/hero262'
import {
  PublicationsSection,
  type PublicationYear,
} from '@/components/publications1'

// ─── data ──────────────────────────────────────────────────────────────────

const theme = {
  name: 'Safety & Security',
  description:
    'DIAL studies how vulnerable populations experience digital threats — stalkerware, surveillance, account takeovers, and online harassment — and builds protective tools grounded in their threat models. Work spans at-risk women, journalists, activists, and LGBTQ+ communities in Bangladesh.',
  stats: [
    { value: '4', label: 'Projects' },
    { value: '12', label: 'Publications' },
    { value: '2', label: 'Research grants' },
  ],
}

const keywords = [
  'Digital Safety',
  'Surveillance',
  'Harassment',
  'Threat Modelling',
  'Privacy',
  'Stalkerware',
]

const projects: ResearchProject[] = [
  {
    id: 'kobok',
    localName: 'কবচ',
    title: 'Kobok',
    abstract:
      'Safety audit toolkit for activists and journalists in Bangladesh, helping them identify and mitigate stalkerware and account compromise.',
    keywords: ['Digital Safety', 'Stalkerware', 'Threat Modelling'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 4,
    slug: 'kobok',
  },
  {
    id: 'shield',
    localName: 'ঢাল',
    title: 'Shield',
    abstract:
      'Browser extension for detecting and blocking targeted harassment campaigns on social media, co-designed with LGBTQ+ communities.',
    keywords: ['Harassment', 'Privacy', 'Digital Safety'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 3,
    award: { title: 'Best Paper · UIST 2023' },
    slug: 'shield',
  },
  {
    id: 'nojor',
    localName: 'নজর',
    title: 'Nojor',
    abstract:
      'Participatory threat modelling methodology developed with domestic abuse survivors to surface surveillance risks in the home.',
    keywords: ['Surveillance', 'Threat Modelling', 'Digital Safety'],
    status: 'completed',
    publicationCount: 4,
    teamMemberCount: 4,
    slug: 'nojor',
  },
  {
    id: 'biram',
    localName: 'বিরাম',
    title: 'Biram',
    abstract:
      'Study of how factory workers navigate corporate surveillance and monitoring apps installed on company-owned devices.',
    keywords: ['Surveillance', 'Privacy'],
    status: 'completed',
    publicationCount: 2,
    teamMemberCount: 3,
    slug: 'biram',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'sp1',
        title: 'Threat Modelling with Activists: Digital Safety Practice in Authoritarian Contexts',
        authors: 'Nova Ahmed, Tanvir Hossain, Lamia Alam',
        venue: 'ACM CHI',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Hossain, T., & Alam, L. (2024). Threat Modelling with Activists. In Proceedings of CHI 2024. ACM.',
        projectLink: '/projects/kobok',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: 'sp2',
        title: 'Shield: Co-designing Anti-harassment Tools with LGBTQ+ Communities in Bangladesh',
        authors: 'Nova Ahmed, Raisa Islam, Fariha Chowdhury',
        venue: 'UIST',
        award: 'Best Paper',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Islam, R., & Chowdhury, F. (2023). Shield. In Proceedings of UIST 2023. ACM.',
        projectLink: '/projects/shield',
      },
    ],
  },
]

interface Collaborator {
  name: string
  role: string
}

interface CollaboratorGroup {
  institution: string
  collaborators: Collaborator[]
}

const collaboratorGroups: CollaboratorGroup[] = [
  {
    institution: 'University of Edinburgh',
    collaborators: [
      { name: 'Kami Vaniea', role: 'Senior Lecturer, Security & Privacy' },
    ],
  },
  {
    institution: 'Access Now',
    collaborators: [{ name: 'Raman Jit Singh Chima', role: 'Senior Counsel' }],
  },
]

const relatedThemes = [
  {
    name: 'Gender & Feminist HCI',
    slug: 'gender-feminist-hci',
    description: 'Technology design through a gendered and intersectional lens.',
  },
  {
    name: 'Infodemic & Misinformation',
    slug: 'infodemic-misinformation',
    description: 'Combating health misinformation and rumour spread online.',
  },
  {
    name: 'Explainable AI & Machine Learning',
    slug: 'explainable-ai-ml',
    description: 'Interpretable, auditable, and fair AI systems.',
  },
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function SafetySecurityPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container flex items-center gap-1.5 py-3 text-sm text-muted-foreground">
          <Link href="/research" className="transition-colors hover:text-foreground">
            Research
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{theme.name}</span>
        </div>
      </div>

      {/* §1 Header */}
      <Hero262
        heading={theme.name}
        subheading=""
        description={theme.description}
        stats={theme.stats}
        className="py-16 lg:py-20"
      />

      {/* §2 Projects */}
      <section className="pb-4 pt-8 lg:pt-12">
        <div className="container mb-6">
          <h2 className="text-3xl font-semibold">Projects</h2>
        </div>
        <Feature295 projects={projects} keywords={keywords} />
      </section>

      {/* §3 Publications */}
      <PublicationsSection yearGroups={publicationYears} />

      {/* §4 Collaborators */}
      <ThemeCollaborators groups={collaboratorGroups} />

      {/* §5 Funding */}
      <section className="py-8 lg:py-12">
        <div className="container">
          <Separator className="mb-10" />
          <h2 className="mb-4 text-xl font-semibold">Funding</h2>
          <p className="text-muted-foreground">
            This research has been supported by{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              Open Technology Fund
            </span>{' '}
            and{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              UKRI
            </span>
            .
          </p>
        </div>
      </section>

      {/* §6 Related themes */}
      <ThemeRelatedAreas themes={relatedThemes} />
    </>
  )
}
