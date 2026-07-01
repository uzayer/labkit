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
  name: 'Infodemic & Misinformation',
  description:
    'DIAL studies how health misinformation spreads through social networks and messaging platforms in Bangladesh, and designs counter-intervention tools grounded in local media literacy and trust dynamics. Work accelerated significantly during and after COVID-19.',
  stats: [
    { value: '4', label: 'Projects' },
    { value: '13', label: 'Publications' },
    { value: '2', label: 'Research grants' },
  ],
}

const keywords = [
  'Misinformation',
  'Health Communication',
  'Social Media',
  'WhatsApp',
  'Fact-checking',
  'Media Literacy',
]

const projects: ResearchProject[] = [
  {
    id: 'sothik',
    localName: 'সঠিক',
    title: 'Sothik',
    abstract:
      'WhatsApp-native fact-checking chatbot for health misinformation, deployed with a Bangladeshi media organisation during COVID-19.',
    keywords: ['Misinformation', 'Fact-checking', 'WhatsApp', 'Health Communication'],
    status: 'ongoing',
    publicationCount: 4,
    teamMemberCount: 4,
    award: { title: 'Best Paper · CSCW 2022' },
    slug: 'sothik',
  },
  {
    id: 'gujob',
    localName: 'গুজব',
    title: 'Gujob',
    abstract:
      'Longitudinal study of rumour propagation on Facebook during the 2021 dengue outbreak, tracing how false cures spread through community groups.',
    keywords: ['Misinformation', 'Social Media', 'Health Communication'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 3,
    slug: 'gujob',
  },
  {
    id: 'bichchar',
    localName: 'বিচার',
    title: 'Bichchar',
    abstract:
      'Media literacy curriculum co-designed with secondary school teachers to help students identify online health misinformation.',
    keywords: ['Media Literacy', 'Misinformation', 'Fact-checking'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 5,
    slug: 'bichchar',
  },
  {
    id: 'alo',
    localName: 'আলো',
    title: 'Alo',
    abstract:
      'Community radio supplement paired with SMS nudges to counter vaccine hesitancy in rural haors of Sunamganj.',
    keywords: ['Health Communication', 'Media Literacy', 'Misinformation'],
    status: 'completed',
    publicationCount: 3,
    teamMemberCount: 4,
    slug: 'alo',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'mp1',
        title: 'Trust, Verification, and the Limits of Fact-Checking on WhatsApp in Bangladesh',
        authors: 'Nova Ahmed, Fariha Chowdhury, Raisa Islam',
        venue: 'ACM CHI',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Chowdhury, F., & Islam, R. (2024). Trust, Verification, and the Limits of Fact-Checking. In Proceedings of CHI 2024. ACM.',
        projectLink: '/projects/sothik',
      },
    ],
  },
  {
    year: 2022,
    publications: [
      {
        id: 'mp2',
        title: 'Sothik: A WhatsApp Chatbot for Health Misinformation Triage During COVID-19',
        authors: 'Nova Ahmed, Lamia Alam, Tanvir Hossain, Fariha Chowdhury',
        venue: 'CSCW',
        award: 'Best Paper',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Alam, L., Hossain, T., & Chowdhury, F. (2022). Sothik. In Proceedings of CSCW 2022. ACM.',
        projectLink: '/projects/sothik',
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
    institution: 'Boom Live Bangladesh',
    collaborators: [
      { name: 'Tasneem Nashrulla', role: 'Editor-in-Chief' },
    ],
  },
  {
    institution: 'WHO Bangladesh',
    collaborators: [{ name: 'Bardan Jung Rana', role: 'Country Representative' }],
  },
  {
    institution: 'Cornell University',
    collaborators: [{ name: 'Mor Naaman', role: 'Professor, Information Science' }],
  },
]

const relatedThemes = [
  {
    name: 'Safety & Security',
    slug: 'safety-security',
    description: 'Threat modelling and protective tools for vulnerable populations.',
  },
  {
    name: 'Explainable AI & Machine Learning',
    slug: 'explainable-ai-ml',
    description: 'Interpretable, auditable, and fair AI systems.',
  },
  {
    name: 'Computing Education & Community',
    slug: 'computing-education-community',
    description: 'Building computing capacity and community in Bangladesh.',
  },
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function InfodemicMisinformationPage() {
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
              WHO Infodemic Response Fund
            </span>{' '}
            and{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              Meta Research
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
