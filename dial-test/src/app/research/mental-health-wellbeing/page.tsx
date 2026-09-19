import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'Mental Health & Wellbeing' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function MentalHealthWellbeingPage() {
  return (
    <ThemePage
      slug="mental-health-wellbeing"
      description={"DIAL designs and evaluates digital tools for mental health support in contexts where formal psychiatric care is scarce. Work spans smartphone-based sensing of depression among students, chatbots for university students, and support for physicians and people with disabilities."}
      relatedSlugs={["accessibility-inclusion", "ictd", "computing-education-community"]}
    />
  )
}
