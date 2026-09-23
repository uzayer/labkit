import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'Gender & Feminist HCI' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function GenderFeministHCIPage() {
  return (
    <ThemePage
      slug="gender-feminist-hci"
      description={
        'DIAL examines how gender shapes technology design, use, and harm — and builds interventions grounded in feminist and intersectional frameworks. Work includes digital safety for women, gendered experiences of social media, and feminist participatory design methods.'
      }
      stakes={{
        plainly:
          'Feminist HCI is not research about women. It is the practice of asking, of any system, whose experience it was built around — and who absorbs the cost when that guess is wrong.',
        why: 'Harassment, monitoring, and loss of privacy are not edge cases in the technology women use in Bangladesh; they are ordinary conditions of use. A safety feature designed for someone with a private phone and a supportive household does very little for someone whose device is shared and whose movements are watched. That is why this work is done with the women who will use the system rather than for them: the constraints that decide whether a design works are not visible from outside them.',
        note: {
          text: "Shaowen Bardzell named feminist HCI as a field at CHI in 2010, arguing that design's claim to neutrality is itself a design decision — one usually made on behalf of whoever the designers most resemble.",
          source: 'Bardzell, CHI 2010',
        },
      }}
      relatedSlugs={['accessibility-inclusion', 'safety-security', 'ictd']}
    />
  )
}
