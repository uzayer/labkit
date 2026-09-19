import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'Infodemic & Misinformation' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function InfodemicMisinformationPage() {
  return (
    <ThemePage
      slug="infodemic-misinformation"
      description={"DIAL studies how information — and its suppression — moves through communities in Bangladesh, from risk communication during and after COVID-19 to the digital silence around student protests, and designs responses grounded in local trust."}
      relatedSlugs={["safety-security", "explainable-ai-ml", "computing-education-community"]}
    />
  )
}
