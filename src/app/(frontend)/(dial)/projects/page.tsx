import { Suspense } from 'react'
import { ClosingNote } from '@/components/dial/closing-note'
import { sectionSpacing } from '@/components/dial/editorial'
import { FaqSection } from '@/components/dial/faq-section'
import { PageHeader } from '@/components/dial/page-header'
import { ProjectDirectory, ProjectIndex } from '@/components/dial/project-index'
import { ScrollRuler } from '@/components/dial/scroll-ruler'
import { projectFaqs } from '@/lib/dial/data/faqs'
import { cn } from '@/lib/utils'
import { getDial } from '@/lib/dial/data/get'

// Rendered per request, not cached like the other DIAL pages: a filtered
// directory (?theme=&status=) must paint filtered on first load. The records it
// reads are still cached (src/lib/dial/data/get.ts).
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Projects',
  description:
    'The complete directory of research projects from the Design Inclusion and Access Lab at North South University.',
}

export default async function ProjectsPage() {
  const { projects, toProjectEntry } = await getDial()
  const entries = projects.map(toProjectEntry)
  const ongoingCount = projects.filter((p) => p.status === 'ongoing').length
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

      <ScrollRuler />

      <section className={cn('container', sectionSpacing, 'pt-0 md:pt-0')}>
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
