import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'Explainable AI & Machine Learning' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function ExplainableAIMLPage() {
  return (
    <ThemePage
      slug="explainable-ai-ml"
      description={"DIAL investigates how AI systems can be made interpretable, auditable, and trustworthy — especially in high-stakes domains like health. Work spans explainable machine learning for detecting depression and other psychological problems, deepfake and medical-image detection, and AI ethics for Bangladesh."}
      relatedSlugs={["ictd", "infodemic-misinformation", "safety-security"]}
    />
  )
}
