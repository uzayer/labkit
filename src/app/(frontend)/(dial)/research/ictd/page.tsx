import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'ICT for Development' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function ICTDPage() {
  return (
    <ThemePage
      slug="ictd"
      description={
        "DIAL builds and evaluates technology interventions for underserved communities across the Global South — from Rohingya refugee health to garment workers' lives and women's financial inclusion. Work is grounded in long-term fieldwork and co-design with the communities themselves."
      }
      stakes={{
        plainly:
          'ICTD — information and communication technologies for development — studies what actually happens when technology designed in one part of the world is deployed in another.',
        why: 'The gap is rarely the hardware. It is language, literacy, bandwidth, cost per megabyte, who in a household owns the phone and who is allowed to use it, and whether the institution behind a service is trusted at all. A design that ignores those does not fail loudly — it is simply not adopted, and the non-adoption is then explained away as a problem with the users. DIAL treats those conditions as the design brief rather than as friction to be overcome.',
        note: {
          text: "Kentaro Toyama's law of amplification: technology amplifies existing human intent and capacity, it does not substitute for them. A working school gets better with computers. A broken one gets more broken, faster.",
          source: 'Toyama, Geek Heresy, 2015',
        },
      }}
      relatedSlugs={['accessibility-inclusion', 'gender-feminist-hci', 'iot-low-cost-hardware']}
    />
  )
}
