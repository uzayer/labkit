import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'Computing Education & Community' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function ComputingEducationCommunityPage() {
  return (
    <ThemePage
      slug="computing-education-community"
      description={
        'DIAL works to broaden participation in computing in Bangladesh — through curriculum research, community building for women in tech, and studies of how students learn programming in under-resourced universities. Work also covers mentorship structures and retention in CS degree programmes.'
      }
      stakes={{
        plainly:
          'This is research on who gets to build computing — which is a different question, with a different answer, from who turns out to be good at it.',
        why: "Who ends up in a computing programme is largely settled before any aptitude is measured: by which school had a working lab, whose family could spare the fees, who was permitted to travel to class, and who ever saw someone like themselves doing the work. DIAL's work here is on widening that entry in Bangladesh, and on the teaching and community structures that decide whether people stay once they have arrived — which is the half of the problem that recruitment drives consistently miss.",
        note: {
          text: 'The share of American computing degrees awarded to women peaked in 1984, at roughly 37%, then fell for two decades. Nothing about the discipline got harder that year; what changed, the standard account argues, is who the home computer was sold to.',
          source: 'US federal degree data · Margolis & Fisher, 2002',
        },
      }}
      relatedSlugs={['gender-feminist-hci', 'iot-low-cost-hardware', 'ictd']}
    />
  )
}
