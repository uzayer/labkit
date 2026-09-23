import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'Accessibility & Inclusion' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function AccessibilityInclusionPage() {
  return (
    <ThemePage
      slug="accessibility-inclusion"
      description={
        'DIAL investigates how people with disabilities, low literacy, and other barriers navigate technology — and designs systems that include them rather than assume them away. Work spans assistive technology for visually impaired people, low-cost wearables for stroke rehabilitation, and tools for children with autism and their caregivers.'
      }
      stakes={{
        plainly:
          'Accessibility research asks a blunt question: when a system assumes someone who can see the screen, read the label, tap accurately, and afford a recent phone, what happens to everyone else?',
        why: 'Those assumptions fail often here, and they fail quietly. An interface never announces that it has excluded someone — the person simply stops using it, and the exclusion leaves no trace in the usage data. DIAL starts from the people the defaults leave out: blind and low-vision users, people who do not read fluently, patients recovering from stroke, children with autism and the carers around them. Designing from their constraints is not the same as retrofitting for them afterwards, and the two rarely produce the same system.',
        note: {
          text: 'The dropped kerb was won by disabled activists in Berkeley in the 1970s. It is now used by anyone pushing a pram, a suitcase or a delivery trolley — the standard evidence that designing for the excluded improves the thing for everybody.',
          source: 'The curb-cut effect',
        },
      }}
      relatedSlugs={['ictd', 'gender-feminist-hci', 'mental-health-wellbeing']}
    />
  )
}
