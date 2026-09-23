import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'IoT & Low-cost Hardware' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function IoTLowCostHardwarePage() {
  return (
    <ThemePage
      slug="iot-low-cost-hardware"
      description={
        'DIAL designs affordable sensor platforms and IoT systems for communities with limited infrastructure. Work ranges from distributed sensing for flash floods to low-cost wearables for driver stress and stroke rehabilitation.'
      }
      stakes={{
        plainly:
          'This is the unglamorous half of computing research: what a sensor costs, whether it survives the monsoon, and who can repair it when it fails.',
        why: "A prototype that works in a lab and costs more than a month's income is a demonstration, not an intervention. Infrastructure here is intermittent by default — power, connectivity, and the supply of spare parts all are — so a device's real specification includes its price, its repairability, and what it does once the network is gone. DIAL builds affordable sensing for exactly those conditions, which is a harder engineering problem than the expensive version, not an easier one.",
        note: {
          text: "Kevin Ashton coined 'the Internet of Things' in 1999 for a talk at Procter & Gamble. As he tells it, the subject was a shade of lipstick that kept going out of stock, and the fix was a radio tag.",
          source: 'Ashton, 1999',
        },
      }}
      relatedSlugs={['ictd', 'computing-education-community', 'explainable-ai-ml']}
    />
  )
}
