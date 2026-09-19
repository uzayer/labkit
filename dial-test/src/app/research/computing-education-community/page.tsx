import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'Computing Education & Community' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function ComputingEducationCommunityPage() {
  return (
    <ThemePage
      slug="computing-education-community"
      description={"DIAL works to broaden participation in computing in Bangladesh — through curriculum research, community building for women in tech, and studies of how students learn programming in under-resourced universities. Work also covers mentorship structures and retention in CS degree programmes."}
      relatedSlugs={["gender-feminist-hci", "iot-low-cost-hardware", "ictd"]}
    />
  )
}
