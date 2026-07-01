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
  name: 'Mental Health & Wellbeing',
  description:
    'DIAL designs and evaluates digital tools for mental health support in contexts where formal psychiatric care is scarce. Work spans university student wellbeing platforms, peer-support networks, and community health worker apps in rural Bangladesh.',
  stats: [
    { value: '4', label: 'Projects' },
    { value: '14', label: 'Publications' },
    { value: '2', label: 'Research grants' },
  ],
}

const keywords = [
  'Mental Health',
  'Peer Support',
  'Wellbeing',
  'University Students',
  'Community Health',
  'Stigma',
]

const projects: ResearchProject[] = [
  {
    id: 'manoshik',
    localName: 'মানসিক',
    title: 'Manoshik',
    abstract:
      'A peer-support platform for university students experiencing depression and anxiety, designed around Bangladeshi cultural norms around help-seeking.',
    keywords: ['Mental Health', 'Peer Support', 'University Students'],
    status: 'ongoing',
    publicationCount: 5,
    teamMemberCount: 4,
    award: { title: 'Best Paper · CHI 2023' },
    slug: 'manoshik',
  },
  {
    id: 'shantir-alo',
    localName: 'শান্তির আলো',
    title: 'Shantir Alo',
    abstract:
      'Mobile decision-support tool for community health workers conducting mental health triage in rural upazila health complexes.',
    keywords: ['Community Health', 'Mental Health', 'Wellbeing'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 5,
    slug: 'shantir-alo',
  },
  {
    id: 'katha',
    localName: 'কথা',
    title: 'Katha',
    abstract:
      'Anonymous confession and support-seeking platform piloted across five public universities in Bangladesh.',
    keywords: ['Mental Health', 'Stigma', 'University Students'],
    status: 'completed',
    publicationCount: 4,
    teamMemberCount: 3,
    slug: 'katha',
  },
  {
    id: 'shohoj',
    localName: 'সহজ',
    title: 'Shohoj',
    abstract:
      'Wellbeing journaling and self-tracking app for garment factory workers, exploring stress from shift work and financial insecurity.',
    keywords: ['Wellbeing', 'Mental Health', 'Stigma'],
    status: 'completed',
    publicationCount: 2,
    teamMemberCount: 3,
    slug: 'shohoj',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'mhp1',
        title: 'Designing Culturally Appropriate Peer Support for University Students in Bangladesh',
        authors: 'Nova Ahmed, Tanvir Hossain, Raisa Islam',
        venue: 'ACM CHI',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Hossain, T., & Islam, R. (2024). Designing Culturally Appropriate Peer Support. In Proceedings of CHI 2024. ACM.',
        projectLink: '/projects/manoshik',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: 'mhp2',
        title: 'Manoshik: A Peer Support Platform for Students Navigating Mental Health Stigma',
        authors: 'Nova Ahmed, Lamia Alam, Tanvir Hossain',
        venue: 'ACM CHI',
        award: 'Best Paper',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Alam, L., & Hossain, T. (2023). Manoshik. In Proceedings of CHI 2023. ACM.',
        projectLink: '/projects/manoshik',
      },
      {
        id: 'mhp3',
        title: '"There is No Word for It": Mental Health Vocabulary Gaps Among Young Adults in Bangladesh',
        authors: 'Nova Ahmed, Fariha Chowdhury, Md. Shafiul Alam',
        venue: 'CSCW',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Chowdhury, F., & Alam, M. S. (2023). There is No Word for It. In Proceedings of CSCW 2023. ACM.',
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
    institution: 'National Institute of Mental Health, Dhaka',
    collaborators: [
      { name: 'Helal Uddin Ahmed', role: 'Professor of Psychiatry' },
    ],
  },
  {
    institution: "King's College London",
    collaborators: [{ name: 'Reza Razavi', role: 'Professor, Digital Health' }],
  },
]

const relatedThemes = [
  {
    name: 'Accessibility & Inclusion',
    slug: 'accessibility-inclusion',
    description: 'Designing systems for users with disabilities and other barriers to access.',
  },
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
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function MentalHealthWellbeingPage() {
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
              Wellcome Trust
            </span>{' '}
            and{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              UKRI Global Challenges Research Fund
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
