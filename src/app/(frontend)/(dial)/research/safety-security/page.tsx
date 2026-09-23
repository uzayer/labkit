import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'Safety & Security' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function SafetySecurityPage() {
  return (
    <ThemePage
      slug="safety-security"
      description={
        'DIAL studies how vulnerable populations experience digital and physical threats — harassment, privacy loss on shared phones, and online risks for teenagers — and builds protective tools grounded in their threat models, from the Protibadi wearable to privacy research with women across South Asia.'
      }
      stakes={{
        plainly:
          'Safety research asks who a system protects and from whom — questions with very different answers for someone whose threat is a stranger and someone whose threat shares their home.',
        why: 'Standard security models assume the attacker is remote and the device is yours. A great deal of real harm fits neither: the phone is shared, the passcode is known to family, and the risk of being seen using a safety tool can exceed the risk it was built to address. DIAL co-designs protective systems with people living in those conditions, because a tool that cannot be used discreetly will not be used at all — and a safety feature nobody dares open is indistinguishable from no safety feature.',
        note: {
          text: "Kerckhoffs's principle, 1883: a system must stay secure even when everything about it is public — everything except the key. A tool whose mere presence on a phone is dangerous has no key left to keep.",
          source: 'Kerckhoffs, 1883',
        },
      }}
      relatedSlugs={['gender-feminist-hci', 'infodemic-misinformation', 'explainable-ai-ml']}
    />
  )
}
