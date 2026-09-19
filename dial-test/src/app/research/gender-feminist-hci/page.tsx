import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'Gender & Feminist HCI' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function GenderFeministHCIPage() {
  return (
    <ThemePage
      slug="gender-feminist-hci"
      description={"DIAL examines how gender shapes technology design, use, and harm — and builds interventions grounded in feminist and intersectional frameworks. Work includes digital safety for women, gendered experiences of social media, and feminist participatory design methods."}
      relatedSlugs={["accessibility-inclusion", "safety-security", "ictd"]}
    />
  )
}
