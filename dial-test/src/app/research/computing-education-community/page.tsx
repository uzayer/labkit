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
  name: 'Computing Education & Community',
  description:
    'DIAL works to broaden participation in computing in Bangladesh — through curriculum research, community building for women in tech, and studies of how students learn programming in under-resourced universities. Work also covers mentorship structures and retention in CS degree programmes.',
  stats: [
    { value: '4', label: 'Projects' },
    { value: '10', label: 'Publications' },
    { value: '2', label: 'Research grants' },
  ],
}

const keywords = [
  'Computing Education',
  'Broadening Participation',
  'Women in Tech',
  'CS Pedagogy',
  'Mentorship',
  'Community Building',
]

const projects: ResearchProject[] = [
  {
    id: 'shikhi',
    localName: 'শিখি',
    title: 'Shikhi',
    abstract:
      'Peer-mentorship platform for women undergraduates in CS programmes at public universities in Bangladesh, focused on retention and belonging.',
    keywords: ['Women in Tech', 'Mentorship', 'Broadening Participation'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 4,
    award: { title: 'Best Paper · ICER 2023' },
    slug: 'shikhi',
  },
  {
    id: 'kotha-kow',
    localName: 'কথা কও',
    title: 'Kotha Kow',
    abstract:
      'Study of how CS students in Bangladesh navigate English-medium instruction and develop programming identity in their first year.',
    keywords: ['CS Pedagogy', 'Computing Education', 'Broadening Participation'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 3,
    slug: 'kotha-kow',
  },
  {
    id: 'dol',
    localName: 'দল',
    title: 'Dol',
    abstract:
      'Community of practice model for rural secondary school computer science teachers, delivered via mobile-first professional development.',
    keywords: ['Community Building', 'CS Pedagogy', 'Computing Education'],
    status: 'ongoing',
    publicationCount: 2,
    teamMemberCount: 5,
    slug: 'dol',
  },
  {
    id: 'probesh',
    localName: 'প্রবেশ',
    title: 'Probesh',
    abstract:
      'Longitudinal study tracking the barriers and motivators of women entering and persisting in computing careers in Bangladesh.',
    keywords: ['Women in Tech', 'Broadening Participation', 'Mentorship'],
    status: 'completed',
    publicationCount: 2,
    teamMemberCount: 3,
    slug: 'probesh',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'ep1',
        title: "Belonging and Barriers: Women's Experiences in CS Undergraduate Programmes in Bangladesh",
        authors: 'Nova Ahmed, Raisa Islam, Fariha Chowdhury',
        venue: 'ACM CHI',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Islam, R., & Chowdhury, F. (2024). Belonging and Barriers. In Proceedings of CHI 2024. ACM.',
        projectLink: '/projects/shikhi',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: 'ep2',
        title: 'Shikhi: Peer Mentorship for Women in Computing at Bangladeshi Universities',
        authors: 'Nova Ahmed, Lamia Alam',
        venue: 'ICER',
        award: 'Best Paper',
        pdfLink: '#',
        citationText:
          'Ahmed, N., & Alam, L. (2023). Shikhi. In Proceedings of ICER 2023. ACM.',
        projectLink: '/projects/shikhi',
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
      { name: 'Muhammad Abdullah Adnan', role: 'Associate Professor, CSE' },
    ],
  },
  {
    institution: 'University of Washington',
    collaborators: [{ name: 'Amy Ko', role: 'Professor, Information School' }],
  },
  {
    institution: 'Bangladesh Computer Council',
    collaborators: [{ name: 'Md. Rezaul Karim', role: 'Executive Director' }],
  },
]

const relatedThemes = [
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
  {
    name: 'ICT for Development',
    slug: 'ictd',
    description: 'Technology interventions for underserved communities in the Global South.',
  },
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function ComputingEducationCommunityPage() {
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
              Google.org
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
