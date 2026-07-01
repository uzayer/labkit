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
  name: 'Accessibility & Inclusion',
  description:
    'DIAL investigates how people with disabilities, low literacy, and other barriers navigate technology — and designs systems that include them rather than assume them away. Work spans voice interfaces for low-literacy users, stroke rehabilitation technology, and accessible financial tools for underserved communities.',
  stats: [
    { value: '6', label: 'Projects' },
    { value: '18', label: 'Publications' },
    { value: '3', label: 'Research grants' },
  ],
}

const keywords = [
  'Voice Interfaces',
  'Low-literacy',
  'Stroke Rehabilitation',
  'Accessible Design',
  'Rural Health',
  'Participatory Design',
]

const projects: ResearchProject[] = [
  {
    id: 'jyoti',
    localName: 'জ্যোতি',
    title: 'Jyoti',
    abstract:
      'A low-literacy voice interface for rural health information access, co-designed with women in rural Bangladesh.',
    keywords: ['Voice Interfaces', 'Low-literacy', 'Rural Health', 'Participatory Design'],
    status: 'ongoing',
    publicationCount: 4,
    teamMemberCount: 5,
    award: { title: 'Best Paper · CHI 2024' },
    slug: 'jyoti',
  },
  {
    id: 'alor-akash',
    localName: 'আলোর আকাশ',
    title: 'Alor Akash',
    abstract:
      'Technology-assisted stroke rehabilitation designed for resource-constrained hospital settings in Bangladesh.',
    keywords: ['Stroke Rehabilitation', 'Accessible Design', 'Participatory Design'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 4,
    slug: 'alor-akash',
  },
  {
    id: 'shonabondhu',
    localName: 'সোনাবন্ধু',
    title: 'Shonabondhu',
    abstract:
      'Voice-based financial literacy interventions for garment workers with low digital literacy.',
    keywords: ['Voice Interfaces', 'Low-literacy', 'Accessible Design'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 3,
    slug: 'shonabondhu',
  },
  {
    id: 'protibadi',
    localName: 'প্রতিবাদী',
    title: 'Protibadi',
    abstract:
      'Digital safety tools co-designed with at-risk women to navigate online harassment and surveillance.',
    keywords: ['Accessible Design', 'Participatory Design'],
    status: 'completed',
    publicationCount: 6,
    teamMemberCount: 3,
    award: { title: 'Best of CHI · 2019' },
    slug: 'protibadi',
  },
  {
    id: 'aparajita',
    localName: 'অপরাজিতা',
    title: 'Aparajita',
    abstract:
      'Skill development platform for women with disabilities returning to the workforce after disability onset.',
    keywords: ['Accessible Design', 'Participatory Design'],
    status: 'completed',
    publicationCount: 2,
    teamMemberCount: 3,
    slug: 'aparajita',
  },
  {
    id: 'tuntuni',
    localName: 'টুনটুনি',
    title: 'Tuntuni',
    abstract:
      'Interactive storytelling platform for children with hearing impairments in under-resourced schools.',
    keywords: ['Accessible Design', 'Low-literacy'],
    status: 'completed',
    publicationCount: 1,
    teamMemberCount: 4,
    slug: 'tuntuni',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'p1',
        title:
          'Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh',
        authors: 'Nova Ahmed, Raisa Islam, Tanvir Hossain, Md. Shafiul Alam',
        venue: 'ACM CHI',
        award: 'Best Paper',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Islam, R., Hossain, T., & Alam, M. S. (2024). Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh. In Proceedings of CHI 2024. ACM.',
        projectLink: '/projects/jyoti',
      },
      {
        id: 'p2',
        title:
          '"I Cannot Afford to Be Sick": Barriers to Healthcare Access Among Low-Income Households in Urban Bangladesh',
        authors: 'Nova Ahmed, Fariha Chowdhury',
        venue: 'ACM COMPASS',
        pdfLink: '#',
        citationText:
          'Ahmed, N., & Chowdhury, F. (2024). "I Cannot Afford to Be Sick": Barriers to Healthcare Access Among Low-Income Households in Urban Bangladesh. In Proceedings of COMPASS 2024. ACM.',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: 'p3',
        title:
          'Designing Voice Interfaces for Non-Literate Users: Lessons from Rural Bangladesh',
        authors: 'Nova Ahmed, Lamia Alam, Raisa Islam',
        venue: 'CSCW',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Alam, L., & Islam, R. (2023). Designing Voice Interfaces for Non-Literate Users: Lessons from Rural Bangladesh. In Proceedings of CSCW 2023. ACM.',
        projectLink: '/projects/jyoti',
      },
    ],
  },
  {
    year: 2019,
    publications: [
      {
        id: 'p4',
        title:
          "They Don't Leave Us Alone Anywhere We Go: Gender and Digital Abuse in South Asia",
        authors:
          'Nithya Sambasivan, Afsaneh Batool, Nova Ahmed, Tara Matthews, Kurt Thomas, Laura Gaytán-Lugo, David Nemer, Elie Bursztein, Elizabeth Churchill, Sunny Consolvo',
        venue: 'ACM CHI',
        award: 'Best of CHI',
        pdfLink: '#',
        citationText:
          "Sambasivan, N., Batool, A., Ahmed, N., et al. (2019). They Don't Leave Us Alone Anywhere We Go. In Proceedings of CHI 2019. ACM.",
        projectLink: '/projects/protibadi',
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
    institution: 'Cardiff University',
    collaborators: [
      { name: 'Matt Jones', role: 'Professor, Co-investigator' },
      { name: 'Parisa Eslambolchilar', role: 'Associate Professor' },
    ],
  },
  {
    institution: 'Google Research India',
    collaborators: [{ name: 'Nithya Sambasivan', role: 'Research Scientist' }],
  },
  {
    institution: 'Microsoft Research India',
    collaborators: [{ name: 'Sriganesh Madhvanath', role: 'Principal Researcher' }],
  },
]

const relatedThemes = [
  {
    name: 'ICT for Development',
    slug: 'ictd',
    description: 'Technology interventions for underserved communities in the Global South.',
  },
  {
    name: 'Gender & Feminist HCI',
    slug: 'gender-feminist-hci',
    description: 'Technology design through a gendered and intersectional lens.',
  },
  {
    name: 'Mental Health & Wellbeing',
    slug: 'mental-health-wellbeing',
    description: 'Digital tools and platforms for mental health support in Bangladesh.',
  },
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function AccessibilityInclusionPage() {
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
              Cardiff University GCRF
            </span>{' '}
            , and{' '}
            <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              Google Research
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
