import { ThemePage } from '@/components/dial/theme-page'

export const metadata = { title: 'Explainable AI & Machine Learning' }

// One of DIAL's nine explicit Research Theme routes (labs/dial/frontend.md).
// The description is hardcoded prose; everything else comes from the records.
export default function ExplainableAIMLPage() {
  return (
    <ThemePage
      slug="explainable-ai-ml"
      description={
        'DIAL investigates how AI systems can be made interpretable, auditable, and trustworthy — especially in high-stakes domains like health. Work spans explainable machine learning for detecting depression and other psychological problems, deepfake and medical-image detection, and AI ethics for Bangladesh.'
      }
      stakes={{
        plainly:
          'Explainability is the question of whether a system can say why — in terms the person affected by the decision can actually use.',
        why: "An accuracy score is a claim made to the people who built the model. It is not an answer to a patient told that a scan looks abnormal, or to anyone told that an automated decision has gone against them. Where a decision arrives with no explanation and no route of appeal, the system has stopped being a tool and become a verdict. DIAL's work is on making algorithmic systems legible to non-experts — including the communities those systems are used on, who are rarely the ones shown the evaluation.",
        note: {
          text: "The phrase 'explainable AI' spread through DARPA's XAI programme in 2016, but the problem is older: medical expert systems in the 1970s already had to justify their diagnoses, because doctors would not act on an answer that arrived without a reason.",
          source: 'DARPA XAI, 2016 · MYCIN, 1970s',
        },
      }}
      relatedSlugs={['ictd', 'infodemic-misinformation', 'safety-security']}
    />
  )
}
