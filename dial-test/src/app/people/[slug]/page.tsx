import { MemberProfile, type MemberProfileData } from '@/components/member-profile'
import { MemberPublications, type MemberPublication } from '@/components/member-publications'
import { ProjectCard, type ProjectEntry } from '@/components/projects-grid'
import { Cta12 } from '@/components/cta12'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ─── types ───────────────────────────────────────────────────────────────────

type Grant = {
  id: string
  title: string
  funder: string
  yearStart: number
  yearEnd?: number
  role: 'Principal Investigator' | 'Co-Investigator'
}

// ─── dummy data ───────────────────────────────────────────────────────────────

const MEMBER: MemberProfileData = {
  name: 'Raisa Islam',
  title: 'PhD Researcher, Department of Electrical and Computer Engineering',
  role: 'graduate-ra',
  affiliation: {
    name: 'North South University',
    url: 'https://www.northsouth.edu',
  },
  photo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg',
  bio: 'Raisa Islam is a PhD researcher at DIAL whose work centres on designing voice interfaces for rural health information access. She uses feminist participatory methods to co-design with women in peri-urban and rural Bangladesh, focusing on how low-literacy populations navigate health decisions when formal systems are out of reach. Her dissertation investigates the cultural and relational dimensions of trust in voice-based systems.',
  researchInterests: [
    'Voice Interfaces',
    'Low-literacy Design',
    'Health Communication',
    'Feminist HCI',
    'Participatory Design',
  ],
  email: 'raisa.islam@northsouth.edu',
  orcid: '0000-0002-1234-5678',
  socials: [
    { platform: 'google-scholar', url: 'https://scholar.google.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'github', url: 'https://github.com' },
  ],
  awards: [
    { title: 'Best Paper · CHI 2024' },
    { title: 'NSU Research Excellence Award 2023' },
  ],
}

const PUBLICATIONS: MemberPublication[] = [
  {
    id: '1',
    title: 'Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh',
    authors: 'Nova Ahmed, Raisa Islam, Tanvir Hossain, Md. Shafiul Alam',
    venue: 'CHI',
    year: 2024,
    award: 'Best Paper',
    pdfLink: '#',
    projectLink: '/projects/jyoti',
    citationText: 'Ahmed, N., Islam, R., Hossain, T., & Alam, M. S. (2024). Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh. In Proceedings of CHI 2024. ACM.',
  },
  {
    id: '2',
    title: 'Alo: Participatory Design of a Crisis Support Tool for Survivors of Gender-Based Violence in Urban Bangladesh',
    authors: 'Nova Ahmed, Nusrat Jahan, Raisa Islam',
    venue: 'DIS',
    year: 2024,
    pdfLink: '#',
    projectLink: '/projects/protibadi',
    citationText: 'Ahmed, N., Jahan, N., & Islam, R. (2024). Alo: Participatory Design of a Crisis Support Tool for Survivors of Gender-Based Violence in Urban Bangladesh. In Proceedings of DIS 2024. ACM.',
  },
  {
    id: '3',
    title: 'Barta: Designing Community-Driven Misinformation Correction Tools for Low-Literacy Populations',
    authors: 'Nova Ahmed, Raisa Islam, Fariha Chowdhury, Sabbir Rahman',
    venue: 'CHI',
    year: 2022,
    award: 'Honorable Mention',
    pdfLink: '#',
    projectLink: '/projects/barta',
    citationText: 'Ahmed, N., Islam, R., Chowdhury, F., & Rahman, S. (2022). Barta: Designing Community-Driven Misinformation Correction Tools for Low-Literacy Populations. In Proceedings of CHI 2022. ACM.',
  },
  {
    id: '4',
    title: 'Shikha: Technology-Mediated Peer Learning Among Adolescent Girls in Rural Bangladesh',
    authors: 'Nova Ahmed, Nusrat Jahan, Raisa Islam',
    venue: 'CSCW',
    year: 2022,
    pdfLink: '#',
    citationText: 'Ahmed, N., Jahan, N., & Islam, R. (2022). Shikha: Technology-Mediated Peer Learning Among Adolescent Girls in Rural Bangladesh. In Proceedings of CSCW 2022. ACM.',
  },
  {
    id: '5',
    title: 'Kotha: Designing Voice Interfaces for Last-Mile Healthcare Worker Reporting in Rural Bangladesh',
    authors: 'Nova Ahmed, Raisa Islam, Sabbir Rahman',
    venue: 'ICTD',
    year: 2021,
    award: 'Best Paper',
    pdfLink: '#',
    citationText: 'Ahmed, N., Islam, R., & Rahman, S. (2021). Kotha: Designing Voice Interfaces for Last-Mile Healthcare Worker Reporting in Rural Bangladesh. In Proceedings of ICTD 2021. ACM.',
  },
]

const PROJECTS: ProjectEntry[] = [
  {
    id: 'jyoti',
    localName: 'জ্যোতি',
    title: 'Jyoti',
    abstract:
      'A low-literacy voice interface for rural health information access, co-designed with women in rural Bangladesh.',
    theme: 'Accessibility & Inclusion',
    keywords: ['Voice Interfaces', 'Low-literacy', 'Rural Health', 'Participatory Design'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    award: { title: 'Best Paper · CHI 2024' },
    slug: 'jyoti',
  },
  {
    id: 'barta',
    localName: 'বার্তা',
    title: 'Barta',
    abstract:
      'Rumour tracking and correction pipeline for health infodemics, deployed during COVID-19 in Bangladesh.',
    theme: 'Infodemic & Misinformation',
    keywords: ['Misinformation', 'COVID-19', 'Health Communication'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'barta',
  },
  {
    id: 'satya',
    localName: 'সত্য',
    title: 'Satya',
    abstract:
      'Community-based misinformation detection and correction tools designed for low-literacy populations in Bangladesh.',
    theme: 'Infodemic & Misinformation',
    keywords: ['Misinformation', 'Health Communication', 'Low-literacy', 'Community'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'satya',
  },
]

const GRANTS: Grant[] = [
  {
    id: 'g1',
    title: 'Voice-Based Health Information Access for Low-Literacy Rural Women in Bangladesh',
    funder: 'Wellcome Trust',
    yearStart: 2022,
    yearEnd: 2025,
    role: 'Co-Investigator',
  },
  {
    id: 'g2',
    title: 'Countering Health Misinformation in Low-Resource Settings',
    funder: 'Google Research',
    yearStart: 2021,
    yearEnd: 2023,
    role: 'Co-Investigator',
  },
]

// ─── page ────────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'Raisa Islam — DIAL',
  description:
    'PhD Researcher at the Design, Inclusion and Access Lab, North South University.',
}

const scholarUrl = MEMBER.socials.find((s) => s.platform === 'google-scholar')?.url

export default function MemberPage() {
  return (
    <>
      <MemberProfile member={MEMBER} />

      <Separator />

      <MemberPublications
        memberName={MEMBER.name}
        publications={PUBLICATIONS}
        scholarUrl={scholarUrl}
      />

      {PROJECTS.length > 0 && (
        <>
          <Separator />
          <section className="py-16">
            <div className="container">
              <h2 className="mb-8 text-2xl font-semibold">Projects</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {PROJECTS.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {GRANTS.length > 0 && (
        <>
          <Separator />
          <section className="py-16">
            <div className="container">
              <h2 className="mb-2 text-2xl font-semibold">Grants</h2>
              <ul className="mt-6 divide-y divide-border">
                {GRANTS.map((grant) => (
                  <li
                    key={grant.id}
                    className="flex flex-col gap-1 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
                  >
                    <div>
                      <p className="font-medium">{grant.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{grant.funder}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {grant.yearStart}–{grant.yearEnd ?? 'Present'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {grant.role}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      <Cta12
        heading="Work with us"
        description="Interested in HCI research for the Global South? We're always looking for passionate researchers to join DIAL."
        buttons={{
          primary: { text: 'Join us', url: '/join-us' },
          secondary: { text: 'Browse projects', url: '/projects' },
        }}
        className="py-24"
      />
    </>
  )
}
