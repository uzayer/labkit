import { Suspense } from 'react'
import { ClosingNote } from '@/components/closing-note'
import { FaqSection } from '@/components/faq-section'
import { PageHeader } from '@/components/page-header'
import { ProjectDirectory, ProjectIndex } from '@/components/project-index'
import { projects } from '@/data'
import { projectFaqs } from '@/data/faqs'
import { toProjectEntry } from '@/data/views'

export const metadata = {
  title: 'Projects',
  description:
    'The complete directory of research projects from the Design Inclusion and Access Lab at North South University.',
}

// ─── derived ─────────────────────────────────────────────────────────────────

const entries = projects.map(toProjectEntry)
const ongoingCount = projects.filter((p) => p.status === 'ongoing').length

// ─── page ────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research"
        art="field"
        title="Projects"
        description="Every DIAL project, from participatory fieldwork to low-cost hardware, with the people, publications, and awards behind each one."
        facts={[
          { value: String(projects.length), label: 'Projects' },
          { value: String(ongoingCount), label: 'Ongoing' },
        ]}
      />

      <section className="container">
        <Suspense fallback={<ProjectIndex projects={entries} themeFilter />}>
          <ProjectDirectory projects={entries} themeFilter />
        </Suspense>
      </section>

      <FaqSection items={projectFaqs} title="About the projects" />


      <ClosingNote
        heading="Want to work on projects like these?"
        links={[
          { text: 'Join the lab', href: '/join-us' },
          { text: 'Browse publications', href: '/publications' },
        ]}
      />
    </>
  )
}
