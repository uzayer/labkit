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
  name: 'ICT for Development',
  description:
    'DIAL builds and evaluates technology interventions for underserved communities across the Global South — from Rohingya refugee camps to remote agricultural villages. Work is grounded in long-term fieldwork and co-design with the communities themselves.',
  stats: [
    { value: '7', label: 'Projects' },
    { value: '24', label: 'Publications' },
    { value: '5', label: 'Research grants' },
  ],
}

const keywords = [
  'ICTD',
  'Livelihoods',
  'Agricultural Technology',
  'Refugee Communities',
  'Financial Inclusion',
  'Participatory Design',
]

const projects: ResearchProject[] = [
  {
    id: 'krishok',
    localName: 'কৃষক',
    title: 'Krishok',
    abstract:
      'Mobile platform co-designed with smallholder farmers in Sylhet and Rangpur for accessing weather forecasts, market prices, and crop advisory.',
    keywords: ['ICTD', 'Agricultural Technology', 'Livelihoods'],
    status: 'ongoing',
    publicationCount: 5,
    teamMemberCount: 5,
    slug: 'krishok',
  },
  {
    id: 'asha',
    localName: 'আশা',
    title: 'Asha',
    abstract:
      'Information and livelihood platform designed with Rohingya refugees at Cox\'s Bazar, navigating severe connectivity and literacy constraints.',
    keywords: ['ICTD', 'Refugee Communities', 'Participatory Design'],
    status: 'ongoing',
    publicationCount: 6,
    teamMemberCount: 6,
    award: { title: 'Best Paper · COMPASS 2023' },
    slug: 'asha',
  },
  {
    id: 'taka',
    localName: 'টাকা',
    title: 'Taka',
    abstract:
      'Mobile money interface redesigned for users with low numeracy, co-developed with a Bangladeshi MFS provider.',
    keywords: ['Financial Inclusion', 'ICTD', 'Participatory Design'],
    status: 'ongoing',
    publicationCount: 4,
    teamMemberCount: 4,
    slug: 'taka',
  },
  {
    id: 'pother-disha',
    localName: 'পথের দিশা',
    title: 'Pother Disha',
    abstract:
      'Navigation and transport information system for rural rickshaw pullers and day labourers in peri-urban areas.',
    keywords: ['ICTD', 'Livelihoods'],
    status: 'completed',
    publicationCount: 3,
    teamMemberCount: 3,
    slug: 'pother-disha',
  },
  {
    id: 'nodi',
    localName: 'নদী',
    title: 'Nodi',
    abstract:
      'Early-warning system for river-island (char) communities facing seasonal flooding and displacement.',
    keywords: ['ICTD', 'Agricultural Technology'],
    status: 'completed',
    publicationCount: 4,
    teamMemberCount: 4,
    slug: 'nodi',
  },
  {
    id: 'haat',
    localName: 'হাট',
    title: 'Haat',
    abstract:
      'Digital marketplace and price-discovery tool piloted in rural periodic markets in northern Bangladesh.',
    keywords: ['ICTD', 'Livelihoods', 'Financial Inclusion'],
    status: 'completed',
    publicationCount: 2,
    teamMemberCount: 3,
    slug: 'haat',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'ip1',
        title: 'Designing for Rohingya Refugees: Constraints, Agency, and Technology in Cox\'s Bazar',
        authors: 'Nova Ahmed, Raisa Islam, Md. Shafiul Alam, Tanvir Hossain',
        venue: 'ACM COMPASS',
        pdfLink: '#',
        citationText:
          "Ahmed, N., Islam, R., Alam, M. S., & Hossain, T. (2024). Designing for Rohingya Refugees. In Proceedings of COMPASS 2024. ACM.",
        projectLink: '/projects/asha',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: 'ip2',
        title: 'Asha: An Information Platform for Forcibly Displaced Communities',
        authors: 'Nova Ahmed, Lamia Alam, Raisa Islam',
        venue: 'ACM COMPASS',
        award: 'Best Paper',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Alam, L., & Islam, R. (2023). Asha. In Proceedings of COMPASS 2023. ACM.',
        projectLink: '/projects/asha',
      },
      {
        id: 'ip3',
        title: 'Numeracy, Trust, and Mobile Money: Redesigning Financial Interfaces for Low-Literate Users',
        authors: 'Nova Ahmed, Fariha Chowdhury',
        venue: 'ACM CHI',
        pdfLink: '#',
        citationText:
          'Ahmed, N., & Chowdhury, F. (2023). Numeracy, Trust, and Mobile Money. In Proceedings of CHI 2023. ACM.',
        projectLink: '/projects/taka',
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
    institution: 'BRAC University',
    collaborators: [
      { name: 'Md. Aminul Islam', role: 'Associate Professor' },
    ],
  },
  {
    institution: 'MIT Media Lab',
    collaborators: [{ name: 'Ethan Zuckerman', role: 'Associate Professor' }],
  },
  {
    institution: 'UNHCR Bangladesh',
    collaborators: [{ name: 'Louis Dupont', role: 'Innovation Officer' }],
  },
]

const relatedThemes = [
  {
    name: 'Accessibility & Inclusion',
    slug: 'accessibility-inclusion',
    description: 'Designing systems for users with disabilities and other barriers to access.',
  },
  {
    name: 'Gender & Feminist HCI',
    slug: 'gender-feminist-hci',
    description: 'Technology design through a gendered and intersectional lens.',
  },
  {
    name: 'IoT & Low-cost Hardware',
    slug: 'iot-low-cost-hardware',
    description: 'Affordable sensor and hardware platforms for community applications.',
  },
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function ICTDPage() {
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
            This research has been supported by the{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              Gates Foundation
            </span>{' '}
            ,{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              UKRI GCRF
            </span>{' '}
            , and{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              USAID
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
