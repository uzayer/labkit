import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'Safety & Security' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function SafetySecurityPage() {
  return (
    <ThemePage
      slug="safety-security"
      description={"DIAL studies how vulnerable populations experience digital and physical threats — harassment, privacy loss on shared phones, and online risks for teenagers — and builds protective tools grounded in their threat models, from the Protibadi wearable to privacy research with women across South Asia."}
      relatedSlugs={["gender-feminist-hci", "infodemic-misinformation", "explainable-ai-ml"]}
    />
  )
}
