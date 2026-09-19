import { ThemePage } from '@/components/theme-page'

export const metadata = { title: 'IoT & Low-cost Hardware' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function IoTLowCostHardwarePage() {
  return (
    <ThemePage
      slug="iot-low-cost-hardware"
      description={"DIAL designs affordable sensor platforms and IoT systems for communities with limited infrastructure. Work ranges from distributed sensing for flash floods to low-cost wearables for driver stress and stroke rehabilitation."}
      relatedSlugs={["ictd", "computing-education-community", "explainable-ai-ml"]}
    />
  )
}
