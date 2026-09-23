import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'Mental Health & Wellbeing' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function MentalHealthWellbeingPage() {
  return (
    <ThemePage
      slug="mental-health-wellbeing"
      description={
        'DIAL designs and evaluates digital tools for mental health support in contexts where formal psychiatric care is scarce. Work spans smartphone-based sensing of depression among students, chatbots for university students, and support for physicians and people with disabilities.'
      }
      stakes={{
        plainly:
          'Digital mental health research asks what technology can honestly do where professional care is scarce — and, just as importantly, what it must never pretend to do.',
        why: "Most wellbeing apps assume someone who can already name what they are feeling, who has privacy on their own device, and who has a clinician to escalate to. Remove any one of those and the design does not merely underperform; it can do harm. DIAL's work is on tools and methods for care in settings where clinical infrastructure is thin and stigma is real — which means designing around disclosure, around families rather than individuals, and around the limits of what software should ever claim to be.",
        note: {
          text: 'Joseph Weizenbaum wrote ELIZA in 1966 as a parody of a therapist. People confided in it anyway — his own secretary asked him to leave the room — and he spent the rest of his career arguing against what he had built.',
          source: 'Weizenbaum, ELIZA, 1966',
        },
      }}
      relatedSlugs={['accessibility-inclusion', 'ictd', 'computing-education-community']}
    />
  )
}
