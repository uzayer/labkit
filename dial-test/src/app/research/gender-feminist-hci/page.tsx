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
  name: 'Gender & Feminist HCI',
  description:
    'DIAL examines how gender shapes technology design, use, and harm — and builds interventions grounded in feminist and intersectional frameworks. Work includes digital safety for women, gendered experiences of social media, and feminist participatory design methods.',
  stats: [
    { value: '5', label: 'Projects' },
    { value: '22', label: 'Publications' },
    { value: '4', label: 'Research grants' },
  ],
}

const keywords = [
  'Feminist HCI',
  'Gender',
  'Digital Safety',
  'Intersectionality',
  'Participatory Design',
  'Social Media',
]

const projects: ResearchProject[] = [
  {
    id: 'ruposhi',
    localName: 'রূপসী',
    title: 'Ruposhi',
    abstract:
      'Investigating gendered experiences of social media among young women in urban Bangladesh, focusing on self-presentation and harassment.',
    keywords: ['Feminist HCI', 'Gender', 'Social Media'],
    status: 'ongoing',
    publicationCount: 5,
    teamMemberCount: 4,
    slug: 'ruposhi',
  },
  {
    id: 'shobar-jonno',
    localName: 'সবার জন্য',
    title: 'Shobar Jonno',
    abstract:
      'Feminist participatory design toolkit co-created with NGO workers to facilitate technology workshops with marginalised women.',
    keywords: ['Feminist HCI', 'Participatory Design', 'Gender'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 5,
    award: { title: 'Best Paper · CSCW 2023' },
    slug: 'shobar-jonno',
  },
  {
    id: 'nirapod',
    localName: 'নিরাপদ',
    title: 'Nirapod',
    abstract:
      'Digital safety tools and awareness curriculum co-designed with at-risk women across urban and peri-urban Bangladesh.',
    keywords: ['Digital Safety', 'Gender', 'Participatory Design'],
    status: 'ongoing',
    publicationCount: 4,
    teamMemberCount: 3,
    slug: 'nirapod',
  },
  {
    id: 'meye',
    localName: 'মেয়ে',
    title: 'Meye',
    abstract:
      'Longitudinal study of how adolescent girls in secondary schools navigate online spaces and negotiate digital identities.',
    keywords: ['Gender', 'Social Media', 'Intersectionality'],
    status: 'completed',
    publicationCount: 6,
    teamMemberCount: 4,
    slug: 'meye',
  },
  {
    id: 'golpo',
    localName: 'গল্প',
    title: 'Golpo',
    abstract:
      'Counter-narrative storytelling platform for survivors of gender-based violence to share experiences safely.',
    keywords: ['Feminist HCI', 'Digital Safety', 'Participatory Design'],
    status: 'completed',
    publicationCount: 4,
    teamMemberCount: 3,
    slug: 'golpo',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'gp1',
        title: "Navigating Dual Publics: Young Women's Self-Presentation on Facebook in Bangladesh",
        authors: 'Nova Ahmed, Lamia Alam, Fariha Chowdhury',
        venue: 'ACM CHI',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Alam, L., & Chowdhury, F. (2024). Navigating Dual Publics. In Proceedings of CHI 2024. ACM.',
        projectLink: '/projects/ruposhi',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: 'gp2',
        title: 'A Feminist Participatory Design Toolkit for Technology Workshops with Marginalised Women',
        authors: 'Nova Ahmed, Raisa Islam, Tanvir Hossain',
        venue: 'CSCW',
        award: 'Best Paper',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Islam, R., & Hossain, T. (2023). A Feminist Participatory Design Toolkit. In Proceedings of CSCW 2023. ACM.',
        projectLink: '/projects/shobar-jonno',
      },
      {
        id: 'gp3',
        title: '"Speak Softly or Stay Silent": Gendered Norms of Online Expression in South Asia',
        authors: 'Nova Ahmed, Fariha Chowdhury',
        venue: 'ACM COMPASS',
        pdfLink: '#',
        citationText:
          'Ahmed, N., & Chowdhury, F. (2023). Speak Softly or Stay Silent. In Proceedings of COMPASS 2023. ACM.',
        projectLink: '/projects/ruposhi',
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
    institution: 'University of Michigan',
    collaborators: [
      { name: 'Kentaro Toyama', role: 'Professor' },
    ],
  },
  {
    institution: 'Google Research India',
    collaborators: [{ name: 'Nithya Sambasivan', role: 'Research Scientist' }],
  },
  {
    institution: 'ActionAid Bangladesh',
    collaborators: [{ name: 'Shaheen Akhter', role: 'Programme Director' }],
  },
]

const relatedThemes = [
  {
    name: 'Accessibility & Inclusion',
    slug: 'accessibility-inclusion',
    description: 'Designing systems for users with disabilities and other barriers to access.',
  },
  {
    name: 'Safety & Security',
    slug: 'safety-security',
    description: 'Threat modelling and protective tools for vulnerable populations.',
  },
  {
    name: 'ICT for Development',
    slug: 'ictd',
    description: 'Technology interventions for underserved communities in the Global South.',
  },
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function GenderFeministHCIPage() {
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
              UKRI
            </span>{' '}
            ,{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              UN Women
            </span>{' '}
            , and{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              Ford Foundation
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
