import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'Accessibility & Inclusion' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function AccessibilityInclusionPage() {
  return (
    <ThemePage
      slug="accessibility-inclusion"
      description={"DIAL investigates how people with disabilities, low literacy, and other barriers navigate technology — and designs systems that include them rather than assume them away. Work spans assistive technology for visually impaired people, low-cost wearables for stroke rehabilitation, and tools for children with autism and their caregivers."}
      relatedSlugs={["ictd", "gender-feminist-hci", "mental-health-wellbeing"]}
    />
  )
}
