import { AlumniGrid } from '@/components/dial/alumni-grid'
import { ScrollRuler } from '@/components/dial/scroll-ruler'
import { ClosingNote } from '@/components/dial/closing-note'
import { SectionHeader, sectionSpacing } from '@/components/dial/editorial'
import { FaqSection } from '@/components/dial/faq-section'
import { PageHeader } from '@/components/dial/page-header'
import { PeopleRoster } from '@/components/dial/people-roster'
import { PIProfile } from '@/components/dial/pi-profile'
import { peopleFaqs } from '@/lib/dial/data/faqs'
import { cn } from '@/lib/utils'
import { getDial } from '@/lib/dial/data/get'

export const metadata = {
  title: 'People',
  description:
    'Meet the researchers, students, and collaborators behind the Design Inclusion and Access Lab at North South University.',
}

export default async function PeoplePage() {
  const { labStats, peopleGroups, alumniList, toPIProfile } = await getDial()
  const stats = labStats()
  const pi = toPIProfile()
  const groups = peopleGroups()
  const alumni = alumniList()

  return (
    <>
      <PageHeader
        eyebrow="Lab"
        art="bloom"
        className="pb-10 md:pb-14"
        title="People"
        description="Faculty, research assistants, and collaborators who run DIAL's fieldwork, build its systems, and write its papers, and the alumni who have moved on."
        facts={[
          { value: String(stats.researchersMentored), label: 'Researchers mentored' },
          { value: String(stats.alumniPlaced), label: 'Alumni placed' },
        ]}
      />

      {pi && <PIProfile pi={pi} />}

      <section className={cn('container', sectionSpacing)}>
        <PeopleRoster
          title="The team"
          groups={[
            { title: 'Faculty & research staff', members: groups.facultyStaff },
            { title: 'Graduate research assistants', members: groups.graduateRAs },
            {
              title: 'Undergraduate research assistants',
              members: groups.undergraduateRAs,
              initialCount: 9,
            },
            { title: 'Collaborators', members: groups.collaborators },
          ]}
        />
      </section>

      {alumni.length > 0 && (
        <section className={cn('container', sectionSpacing)}>
          <SectionHeader
            label="Alumni"
            title="Where our people go"
            description="DIAL alumni are in PhD programmes, research institutions, and industry."
            className="mb-8"
          />
          <AlumniGrid alumni={alumni} />
        </section>
      )}

      {/* On the tighter rhythm the rest of this page runs on. */}
      <FaqSection items={peopleFaqs} title="About the roster" className={sectionSpacing} />

      <ScrollRuler />

      <ClosingNote
        className="pt-4"
        heading="No prerequisites. Curious about HCI and ready for fieldwork in Bangladesh?"
        links={[
          { text: 'Apply to join', href: '/join-us' },
          { text: 'Contact the lab', href: '/contact' },
        ]}
      />
    </>
  )
}
