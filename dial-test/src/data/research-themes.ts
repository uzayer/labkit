import type { ResearchTheme } from './types'

/**
 * DIAL's nine Research Themes, one per explicit `/research/<slug>` route.
 *
 * The taxonomy comes from the dial-test prototype, not from a capture: the only
 * captured list (DIAL Proposal.md, "Research Themes") has six different labels
 * (HCI; HCI and AI; XAI; Explainable ML; Vision; Low-cost Hardware and IoT), and
 * the NSU home page names five domains (Health, Accessibility, Women in STEM,
 * Financial Technology, Social Computing). Needs DIAL confirmation — see
 * labs/dial/identity.md. `shortDescription` is the prototype's card copy;
 * `featured` marks the prototype's original six home-page themes.
 */
const PROTOTYPE_NOTE =
  'dial-test prototype theme route; taxonomy not in any capture (DIAL Proposal.md "Research Themes" lists six different labels)'

export const researchThemes: ResearchTheme[] = [
  {
    id: 'accessibility-inclusion',
    slug: 'accessibility-inclusion',
    title: 'Accessibility & Inclusion',
    shortDescription:
      'Interfaces for low-literacy, disabled, and resource-constrained communities.',
    featured: true,
  },
  {
    id: 'gender-feminist-hci',
    slug: 'gender-feminist-hci',
    title: 'Gender & Feminist HCI',
    shortDescription: 'Participatory research on safety, dignity, agency, and digital voice.',
    featured: true,
  },
  {
    id: 'mental-health-wellbeing',
    slug: 'mental-health-wellbeing',
    title: 'Mental Health & Wellbeing',
    shortDescription: 'Tools and methods for care where clinical infrastructure is limited.',
    featured: true,
  },
  {
    id: 'explainable-ai-ml',
    slug: 'explainable-ai-ml',
    title: 'Explainable AI & Machine Learning',
    shortDescription:
      'Making algorithmic systems legible to non-experts and affected communities.',
    featured: true,
  },
  {
    id: 'ictd',
    slug: 'ictd',
    title: 'ICT for Development',
    shortDescription:
      'Technology interventions grounded in language, trust, bandwidth, and devices.',
    featured: true,
  },
  {
    id: 'safety-security',
    slug: 'safety-security',
    title: 'Safety & Security',
    shortDescription: 'Digital safety systems co-designed with people facing real-world risk.',
    featured: true,
  },
  {
    id: 'iot-low-cost-hardware',
    slug: 'iot-low-cost-hardware',
    title: 'IoT & Low-cost Hardware',
    shortDescription:
      'Affordable sensors and devices for places with limited infrastructure.',
    featured: false,
  },
  {
    id: 'infodemic-misinformation',
    slug: 'infodemic-misinformation',
    title: 'Infodemic & Misinformation',
    shortDescription:
      'How health misinformation spreads, and counter-tools built on local trust.',
    featured: false,
  },
  {
    id: 'computing-education-community',
    slug: 'computing-education-community',
    title: 'Computing Education & Community',
    shortDescription:
      'Broadening who gets to study, teach, and build computing in Bangladesh.',
    featured: false,
  },
].map((theme) => ({ ...theme, provenance: { source: 'manual' as const, sourceNote: PROTOTYPE_NOTE } }))
