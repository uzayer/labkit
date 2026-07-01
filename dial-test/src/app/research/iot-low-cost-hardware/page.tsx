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
  name: 'IoT & Low-cost Hardware',
  description:
    'DIAL designs affordable sensor platforms and IoT systems for communities with limited infrastructure. Work ranges from air quality monitors built from commodity components to low-power flood sensors deployed on Bangladesh\'s river-island chars.',
  stats: [
    { value: '4', label: 'Projects' },
    { value: '11', label: 'Publications' },
    { value: '2', label: 'Research grants' },
  ],
}

const keywords = [
  'IoT',
  'Low-cost Hardware',
  'Environmental Sensing',
  'Flood Detection',
  'Air Quality',
  'Maker',
]

const projects: ResearchProject[] = [
  {
    id: 'batas',
    localName: 'বাতাস',
    title: 'Batas',
    abstract:
      'Low-cost PM2.5 and CO2 sensor network deployed in garment factory districts of Dhaka to study air quality exposure among workers.',
    keywords: ['IoT', 'Low-cost Hardware', 'Air Quality', 'Environmental Sensing'],
    status: 'ongoing',
    publicationCount: 4,
    teamMemberCount: 4,
    award: { title: 'Best Paper · ACM DEV 2023' },
    slug: 'batas',
  },
  {
    id: 'bonnya',
    localName: 'বন্যা',
    title: 'Bonnya',
    abstract:
      'Solar-powered flood sensor nodes for early warning on Bangladesh\'s char islands, transmitting via LoRaWAN.',
    keywords: ['IoT', 'Flood Detection', 'Low-cost Hardware'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 5,
    slug: 'bonnya',
  },
  {
    id: 'shilpo',
    localName: 'শিল্প',
    title: 'Shilpo',
    abstract:
      'Maker education programme introducing low-cost microcontroller-based prototyping to secondary school students in Dhaka.',
    keywords: ['Maker', 'IoT', 'Low-cost Hardware'],
    status: 'completed',
    publicationCount: 2,
    teamMemberCount: 3,
    slug: 'shilpo',
  },
  {
    id: 'paani',
    localName: 'পানি',
    title: 'Paani',
    abstract:
      'Community-managed water quality monitoring system for arsenic and turbidity, deployed across 12 rural villages.',
    keywords: ['IoT', 'Environmental Sensing', 'Low-cost Hardware'],
    status: 'completed',
    publicationCount: 2,
    teamMemberCount: 4,
    slug: 'paani',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'iop1',
        title: 'Batas: Participatory Air Quality Sensing in Industrial Bangladesh',
        authors: 'Nova Ahmed, Tanvir Hossain, Md. Shafiul Alam',
        venue: 'ACM CHI',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Hossain, T., & Alam, M. S. (2024). Batas. In Proceedings of CHI 2024. ACM.',
        projectLink: '/projects/batas',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: 'iop2',
        title: 'Low-cost Flood Sensing for Char Islands: Deployment Lessons from Bangladesh',
        authors: 'Nova Ahmed, Lamia Alam',
        venue: 'ACM DEV',
        award: 'Best Paper',
        pdfLink: '#',
        citationText:
          'Ahmed, N., & Alam, L. (2023). Low-cost Flood Sensing for Char Islands. In Proceedings of ACM DEV 2023. ACM.',
        projectLink: '/projects/bonnya',
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
    institution: 'BUET',
    collaborators: [
      { name: 'A. B. M. Alim Al Islam', role: 'Professor, CSE' },
    ],
  },
  {
    institution: 'Imperial College London',
    collaborators: [{ name: 'Julie McCann', role: 'Professor, Distributed Systems' }],
  },
]

const relatedThemes = [
  {
    name: 'ICT for Development',
    slug: 'ictd',
    description: 'Technology interventions for underserved communities in the Global South.',
  },
  {
    name: 'Computing Education & Community',
    slug: 'computing-education-community',
    description: 'Building computing capacity and community in Bangladesh.',
  },
  {
    name: 'Explainable AI & Machine Learning',
    slug: 'explainable-ai-ml',
    description: 'Interpretable, auditable, and fair AI systems.',
  },
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function IoTLowCostHardwarePage() {
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
              EPSRC
            </span>{' '}
            and{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              ICT Division, Bangladesh
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
