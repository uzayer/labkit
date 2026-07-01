import { Suspense } from 'react'
import { Cta12 } from '@/components/cta12'
import { Hero262 } from '@/components/hero262'
import { ProjectsGrid, type ProjectEntry } from '@/components/projects-grid'

export const metadata = {
  title: 'Projects — DIAL',
  description:
    'The complete directory of research projects from the Design, Inclusion and Access Lab at North South University.',
}

// ─── data ───────────────────────────────────────────────────────────────────

const projects: ProjectEntry[] = [
  // Accessibility & Inclusion
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
    id: 'alor-akash',
    localName: 'আলোর আকাশ',
    title: 'Alor Akash',
    abstract:
      'Technology-assisted stroke rehabilitation designed for resource-constrained hospital settings in Bangladesh.',
    theme: 'Accessibility & Inclusion',
    keywords: ['Stroke Rehabilitation', 'Accessible Design', 'Participatory Design'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'alor-akash',
  },
  {
    id: 'shonabondhu',
    localName: 'সোনাবন্ধু',
    title: 'Shonabondhu',
    abstract:
      'Voice-based financial literacy interventions for garment workers with low digital literacy.',
    theme: 'Accessibility & Inclusion',
    keywords: ['Voice Interfaces', 'Low-literacy', 'Financial Literacy', 'Garment Workers'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'shonabondhu',
  },
  {
    id: 'aparajita',
    localName: 'অপরাজিতা',
    title: 'Aparajita',
    abstract:
      'Skill development platform for women with disabilities returning to the workforce after disability onset.',
    theme: 'Accessibility & Inclusion',
    keywords: ['Accessible Design', 'Participatory Design', 'Gender'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'aparajita',
  },
  {
    id: 'tuntuni',
    localName: 'টুনটুনি',
    title: 'Tuntuni',
    abstract:
      'Interactive storytelling platform for children with hearing impairments in under-resourced schools.',
    theme: 'Accessibility & Inclusion',
    keywords: ['Accessible Design', 'Low-literacy', 'Children'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'tuntuni',
  },
  // Safety & Security
  {
    id: 'protibadi',
    localName: 'প্রতিবাদী',
    title: 'Protibadi',
    abstract:
      'Digital safety tools co-designed with at-risk women to navigate online harassment and surveillance.',
    theme: 'Safety & Security',
    keywords: ['Digital Safety', 'Gender-based Violence', 'Participatory Design'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    award: { title: 'Best of CHI · 2019' },
    slug: 'protibadi',
  },
  {
    id: 'nirapod',
    localName: 'নিরাপদ',
    title: 'Nirapod',
    abstract:
      'Safety infrastructure and threat-modelling support for journalists and activists facing digital risks in South Asia.',
    theme: 'Safety & Security',
    keywords: ['Digital Safety', 'Threat Modelling', 'Journalists'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'nirapod',
  },
  // Infodemic & Misinformation
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
  // Mental Health & Wellbeing
  {
    id: 'mon',
    localName: 'মন',
    title: 'Mon',
    abstract:
      'A mobile platform supporting peer mental health disclosure and help-seeking among Bangladeshi university students.',
    theme: 'Mental Health & Wellbeing',
    keywords: ['Mental Health', 'Peer Support', 'University Students', 'Stigma'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'mon',
  },
  {
    id: 'shukhee-jibon',
    localName: 'সুখী জীবন',
    title: 'Shukhee Jibon',
    abstract:
      'Digital wellbeing tools for garment workers navigating occupational stress and workplace exploitation.',
    theme: 'Mental Health & Wellbeing',
    keywords: ['Mental Health', 'Garment Workers', 'Workplace Wellbeing'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'shukhee-jibon',
  },
  // ICT for Development
  {
    id: 'ashroy',
    localName: 'আশ্রয়',
    title: 'Ashroy',
    abstract:
      "Technology mediation and information access for Rohingya refugees in Cox's Bazar camps.",
    theme: 'ICT for Development',
    keywords: ['Refugees', 'Information Access', 'Crisis', 'Community'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'ashroy',
  },
  {
    id: 'krishok',
    localName: 'কৃষক',
    title: 'Krishok',
    abstract:
      'ICT tools for smallholder farmers to access market prices, weather data, and agricultural guidance.',
    theme: 'ICT for Development',
    keywords: ['Agriculture', 'Rural Development', 'Market Information', 'Low-literacy'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'krishok',
  },
  // Computing Education & Community
  {
    id: 'shikkha',
    localName: 'শিক্ষা',
    title: 'Shikkha',
    abstract:
      'Ethics curriculum for computing education in South Asian universities, developed through participatory workshop design.',
    theme: 'Computing Education & Community',
    keywords: ['Computing Education', 'Ethics', 'Curriculum', 'South Asia'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    award: { title: 'Best Journal Paper · COMPASS 2023' },
    slug: 'shikkha',
  },
  {
    id: 'poriborton',
    localName: 'পরিবর্তন',
    title: 'Poriborton',
    abstract:
      'Community computing outreach for high-school students in underserved urban neighbourhoods of Dhaka.',
    theme: 'Computing Education & Community',
    keywords: ['Computing Education', 'Outreach', 'Youth', 'Urban'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'poriborton',
  },
  // Explainable AI & ML
  {
    id: 'bodhgamya',
    localName: 'বোধগম্য',
    title: 'Bodhgamya',
    abstract:
      'Explainability interfaces for AI-assisted clinical decision support in resource-limited healthcare settings.',
    theme: 'Explainable AI & ML',
    keywords: ['Explainable AI', 'Healthcare', 'Clinical Decision Support'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'bodhgamya',
  },
  {
    id: 'bishwas',
    localName: 'বিশ্বাস',
    title: 'Bishwas',
    abstract:
      'Trust calibration in AI recommendations for community health workers in rural Bangladesh.',
    theme: 'Explainable AI & ML',
    keywords: ['Explainable AI', 'Community Health', 'Trust', 'Rural Health'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'bishwas',
  },
  // Gender & Feminist HCI
  {
    id: 'aamar-kotha',
    localName: 'আমার কথা',
    title: 'Aamar Kotha',
    abstract:
      'Feminist participatory design methodology for technology development with and for women in South Asia.',
    theme: 'Gender & Feminist HCI',
    keywords: ['Feminist HCI', 'Participatory Design', 'Gender', 'Methodology'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'aamar-kotha',
  },
  {
    id: 'nari-shakti',
    localName: 'নারী শক্তি',
    title: 'Nari Shakti',
    abstract:
      'Digital agency and self-expression tools for women navigating patriarchal household technology norms.',
    theme: 'Gender & Feminist HCI',
    keywords: ['Feminist HCI', 'Gender-based Violence', 'Digital Agency'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'nari-shakti',
  },
  // IoT & Low-Cost Hardware
  {
    id: 'rashmi',
    localName: 'রশ্মি',
    title: 'Rashmi',
    abstract:
      'Low-cost IoT air quality monitoring designed for deployment in garment factory floors.',
    theme: 'IoT & Low-Cost Hardware',
    keywords: ['IoT', 'Air Quality', 'Low-cost Hardware', 'Garment Workers'],
    status: 'completed',
    leadResearcher: 'Nova Ahmed',
    slug: 'rashmi',
  },
  {
    id: 'drishtipat',
    localName: 'দৃষ্টিপাত',
    title: 'Drishtipat',
    abstract:
      'Affordable eye-tracking hardware and gaze-based AAC interfaces for users with severe motor impairments.',
    theme: 'IoT & Low-Cost Hardware',
    keywords: ['IoT', 'Eye Tracking', 'AAC', 'Low-cost Hardware', 'Accessible Design'],
    status: 'ongoing',
    leadResearcher: 'Nova Ahmed',
    slug: 'drishtipat',
  },
]

// ─── derived ─────────────────────────────────────────────────────────────────

const themes = [...new Set(projects.map((p) => p.theme))].sort()
const keywords = [...new Set(projects.flatMap((p) => p.keywords))].sort()
const totalCount = projects.length
const ongoingCount = projects.filter((p) => p.status === 'ongoing').length

// ─── page ────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  return (
    <>
      <Hero262
        heading="Projects"
        subheading="Every DIAL project — from participatory fieldwork to low-cost hardware — in one browsable directory."
        description=""
        stats={[
          { value: String(totalCount), label: 'Projects' },
          { value: String(ongoingCount), label: 'Ongoing' },
        ]}
      />

      <Suspense>
        <ProjectsGrid
          projects={projects}
          themes={themes}
          keywords={keywords}
          className="pb-16 pt-4"
        />
      </Suspense>

      <Cta12
        heading="Found something interesting?"
        description="Join the lab to work on projects like these, or browse the publications they produced."
        buttons={{
          primary: { text: 'Join us', url: '/join-us' },
          secondary: { text: 'Browse publications', url: '/publications' },
        }}
        className="py-24"
      />
    </>
  )
}
