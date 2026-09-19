import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'ICT for Development' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function ICTDPage() {
  return (
    <ThemePage
      slug="ictd"
      description={"DIAL builds and evaluates technology interventions for underserved communities across the Global South — from Rohingya refugee health to garment workers' lives and women's financial inclusion. Work is grounded in long-term fieldwork and co-design with the communities themselves."}
      relatedSlugs={["accessibility-inclusion", "gender-feminist-hci", "iot-low-cost-hardware"]}
    />
  )
}
