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
  name: 'Explainable AI & Machine Learning',
  description:
    'DIAL investigates how AI systems can be made interpretable, auditable, and trustworthy — especially in high-stakes domains like healthcare and public administration. Work spans algorithmic fairness audits, explanation interfaces for non-expert users, and participatory AI design.',
  stats: [
    { value: '5', label: 'Projects' },
    { value: '16', label: 'Publications' },
    { value: '3', label: 'Research grants' },
  ],
}

const keywords = [
  'Explainability',
  'Fairness',
  'Algorithmic Auditing',
  'Human-AI Interaction',
  'Healthcare AI',
  'Participatory AI',
]

const projects: ResearchProject[] = [
  {
    id: 'sposhto',
    localName: 'স্পষ্ট',
    title: 'Sposhto',
    abstract:
      'Explanation interface for AI-assisted clinical decision support used by physicians in public hospitals in Dhaka.',
    keywords: ['Explainability', 'Healthcare AI', 'Human-AI Interaction'],
    status: 'ongoing',
    publicationCount: 4,
    teamMemberCount: 5,
    award: { title: 'Honourable Mention · CHI 2024' },
    slug: 'sposhto',
  },
  {
    id: 'nyay',
    localName: 'ন্যায়',
    title: 'Nyay',
    abstract:
      'Participatory algorithmic audit framework applied to social benefit allocation systems in Bangladesh.',
    keywords: ['Fairness', 'Algorithmic Auditing', 'Participatory AI'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 4,
    slug: 'nyay',
  },
  {
    id: 'bishwas',
    localName: 'বিশ্বাস',
    title: 'Bishwas',
    abstract:
      'Study of how frontline health workers form trust in — and workarounds around — AI triage recommendations.',
    keywords: ['Human-AI Interaction', 'Healthcare AI', 'Explainability'],
    status: 'ongoing',
    publicationCount: 3,
    teamMemberCount: 3,
    slug: 'bishwas',
  },
  {
    id: 'dorpan',
    localName: 'দর্পণ',
    title: 'Dorpan',
    abstract:
      'Fairness audit tool for ML models used in university admissions, developed with the University Grants Commission.',
    keywords: ['Fairness', 'Algorithmic Auditing'],
    status: 'completed',
    publicationCount: 4,
    teamMemberCount: 4,
    slug: 'dorpan',
  },
  {
    id: 'bujhi',
    localName: 'বুঝি',
    title: 'Bujhi',
    abstract:
      'Lay-language explanation generator for black-box ML predictions, evaluated with non-expert users in Bangladesh.',
    keywords: ['Explainability', 'Human-AI Interaction'],
    status: 'completed',
    publicationCount: 2,
    teamMemberCount: 3,
    slug: 'bujhi',
  },
]

const publicationYears: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: 'xp1',
        title: 'Sposhto: Explainable AI for Clinical Decision Support in Resource-Constrained Settings',
        authors: 'Nova Ahmed, Md. Shafiul Alam, Tanvir Hossain',
        venue: 'ACM CHI',
        award: 'Honourable Mention',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Alam, M. S., & Hossain, T. (2024). Sposhto. In Proceedings of CHI 2024. ACM.',
        projectLink: '/projects/sposhto',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: 'xp2',
        title: 'Participatory Algorithmic Auditing in the Global South: Lessons from Bangladesh',
        authors: 'Nova Ahmed, Raisa Islam, Fariha Chowdhury',
        venue: 'FAccT',
        pdfLink: '#',
        citationText:
          'Ahmed, N., Islam, R., & Chowdhury, F. (2023). Participatory Algorithmic Auditing in the Global South. In Proceedings of FAccT 2023. ACM.',
        projectLink: '/projects/nyay',
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
    institution: 'Alan Turing Institute',
    collaborators: [
      { name: 'Bettina Berendt', role: 'Professor, Responsible AI' },
    ],
  },
  {
    institution: 'University of Toronto',
    collaborators: [{ name: 'Deval Pandya', role: 'Research Associate' }],
  },
  {
    institution: 'icddr,b',
    collaborators: [{ name: 'Tahmeed Ahmed', role: 'Executive Director' }],
  },
]

const relatedThemes = [
  {
    name: 'ICT for Development',
    slug: 'ictd',
    description: 'Technology interventions for underserved communities in the Global South.',
  },
  {
    name: 'Infodemic & Misinformation',
    slug: 'infodemic-misinformation',
    description: 'Combating health misinformation and rumour spread online.',
  },
  {
    name: 'Safety & Security',
    slug: 'safety-security',
    description: 'Threat modelling and protective tools for vulnerable populations.',
  },
]

// ─── page ───────────────────────────────────────────────────────────────────

export default function ExplainableAIMLPage() {
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
              UKRI Trustworthy Autonomous Systems
            </span>{' '}
            and{' '}
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
