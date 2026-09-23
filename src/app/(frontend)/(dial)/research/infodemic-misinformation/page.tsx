import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'Infodemic & Misinformation' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function InfodemicMisinformationPage() {
  return (
    <ThemePage
      slug="infodemic-misinformation"
      description={
        'DIAL studies how information — and its suppression — moves through communities in Bangladesh, from risk communication during and after COVID-19 to the digital silence around student protests, and designs responses grounded in local trust.'
      }
      stakes={{
        plainly:
          'Misinformation research is less about what is false than about why a false thing travels — who passes it on, and what they are right about that the correction gets wrong.',
        why: 'Health rumours move through the same channels as trustworthy advice: family groups, neighbours, a pharmacist, a religious leader. A correction arriving from outside those channels, in the wrong language or the wrong register, does not land — and repeating a false claim in order to debunk it can carry it further than it would have gone. DIAL studies how this information moves in Bangladesh, and builds responses on the trust that already exists rather than on the assumption that facts win by themselves.',
        note: {
          text: "'Infodemic' was coined by David Rothkopf in a 2003 newspaper column about SARS. It sat unused for seventeen years until the WHO revived it in February 2020 — before most countries had recorded a single COVID case.",
          source: 'Rothkopf, 2003 · WHO, 2020',
        },
      }}
      relatedSlugs={['safety-security', 'explainable-ai-ml', 'computing-education-community']}
    />
  )
}
