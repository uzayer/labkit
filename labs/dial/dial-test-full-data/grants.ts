import type { Grant } from './types'

/**
 * Grants made to DIAL or its Projects.
 *
 * Most rows come from the Proposal's "Funding Information" table (DIAL
 * Proposal.md), whose "Amount (BDT)" column mixes currencies and number
 * formats. `amountValue` is set only when the figure is unambiguous; otherwise
 * the raw text stays in `amountLabel`. Tenure years become year-only ISO dates.
 * `status` is left null: whether a Grant is active is derived from `endDate`
 * (see `isGrantActive` in ./index.ts).
 *
 * Not recorded as Grants: the personal-site "Funding" lines that have no title
 * or duplicate a row below, the Proposal's ACM SIGCHI Development Grants (no
 * project), and "Higher Education Acceleration & Transformation - 2025-2028"
 * (awards.md gives no funder, amount, or investigator).
 */
const FUNDING = 'DIAL Proposal.md — "Funding Information"'

// Heuristic theme assignment throughout: no capture tags Grants with themes;
// each is judged from the Grant's title.
export const grants: Grant[] = [
  {
    id: 'uiu-nsu-pwd-mental-health',
    slug: 'uiu-nsu-pwd-mental-health',
    title: 'Exploring mental health for People With Disabilities (PWD)',
    funder: 'uiu',
    funderLabel: 'UIU-NSU collaborative fund',
    amountValue: 499999,
    amountCurrency: 'BDT',
    startDate: '2024',
    endDate: '2025',
    investigators: [
      { teamMember: 'nova-ahmed', role: 'pi' },
      { teamMember: 'salekul-islam', role: 'co-pi' },
    ],
    themes: ['mental-health-wellbeing', 'accessibility-inclusion'],
    provenance: { source: 'scrape', sourceNote: `${FUNDING} (co-PI given as "Dr. Salekul")` },
  },
  {
    id: 'sipg-small-business',
    slug: 'sipg-small-business',
    title: 'Technology usage for small businesses',
    funder: 'sipg',
    funderLabel: 'SIPG Grant',
    amountValue: 200000,
    amountCurrency: 'BDT',
    startDate: '2023',
    endDate: '2024',
    investigators: [
      { teamMember: 'abdul-wohab', role: 'pi' },
      { teamMember: 'nova-ahmed', role: 'co-pi' },
    ],
    themes: ['ictd'],
    provenance: { source: 'scrape', sourceNote: FUNDING },
  },
  {
    id: 'cps-sipg-02-ai-ethics',
    slug: 'cps-sipg-02-ai-ethics',
    title: 'Understanding AI and Ethics',
    funder: 'sipg',
    funderLabel: 'CPS-SIPG-02 (NSU)',
    amountValue: 300000,
    amountCurrency: 'BDT',
    startDate: '2022',
    endDate: '2023',
    investigators: [{ teamMember: 'nova-ahmed', role: 'pi' }],
    themes: ['explainable-ai-ml'],
    provenance: { source: 'scrape', sourceNote: FUNDING },
  },
  {
    id: 'gates-fintech-barriers',
    slug: 'gates-fintech-barriers',
    title: 'Understanding technology and fintech barriers for women and marginal ones',
    funder: 'gates-foundation',
    funderLabel: 'Bill and Melinda Gates Foundation',
    // The personal site states "funding of 231,000 USD"; the Proposal gives
    // "2,00,97,000 ($231,000)". awards.md dates the grant 2022 instead.
    amountValue: 231000,
    amountCurrency: 'USD',
    amountLabel: '2,00,97,000 BDT ($231,000)',
    startDate: '2020',
    endDate: '2022',
    investigators: [{ teamMember: 'nova-ahmed', role: 'pi' }],
    themes: ['gender-feminist-hci', 'ictd'],
    featured: true,
    provenance: {
      source: 'scrape',
      sourceNote: `${FUNDING}; amount confirmed by nova-ahmed-personal-site/awards.md — "Funding"`,
    },
  },
  {
    id: 'google-south-asia-research',
    slug: 'google-south-asia-research',
    title: 'Google South Asian Grant',
    funder: 'google',
    funderLabel: 'Google',
    amountValue: 20000,
    amountCurrency: 'USD',
    amountLabel: '20,00000 ($20,000)',
    startDate: '2021',
    endDate: '2022',
    investigators: [{ teamMember: 'nova-ahmed', role: 'pi' }],
    themes: [],
    featured: true,
    provenance: {
      source: 'scrape',
      sourceNote: `${FUNDING}. The personal site lists "Google South Asia & Southeast Asia Research Awards, 2022. Amount 20,000 USD" and awards.md "Google Research Grant - 2023"; not merged.`,
    },
  },
  {
    id: 'ctrg-22-seps-01-autism-parent-teacher',
    slug: 'ctrg-22-seps-01-autism-parent-teacher',
    title: 'Exploring parent-teacher challenges for children with Autism',
    funder: 'nsu',
    funderLabel: 'NSU CTRG (CTRG-22-SEPS-01)',
    amountValue: 499999,
    amountCurrency: 'BDT',
    startDate: '2022',
    endDate: '2023',
    investigators: [
      { teamMember: 'nova-ahmed', role: 'pi' },
      { teamMember: 'shameem-ahmed', role: 'co-pi' },
    ],
    themes: ['accessibility-inclusion'],
    provenance: { source: 'scrape', sourceNote: FUNDING },
  },
  {
    id: 'gcrf-stroke-wearables',
    slug: 'gcrf-stroke-wearables',
    title: 'Exploring stroke patient wearables',
    funder: 'ukri-gcrf',
    funderLabel: 'GCRF Fund',
    // Conflict: the Proposal says "5,00,000 Euro" (2020-2021); the personal site
    // says "5000 Euro" (2021, in collaboration with Cardiff University).
    amountValue: null,
    amountCurrency: 'EUR',
    amountLabel: '5,00,000 Euro (Proposal) / 5000 Euro (personal site)',
    startDate: '2020',
    endDate: '2021',
    investigators: [
      {
        customInvestigator: { name: 'Katarzina Sawaz', affiliation: 'cardiff-university' },
        role: 'pi',
      },
      { teamMember: 'nova-ahmed', role: 'co-pi' },
    ],
    themes: ['accessibility-inclusion', 'iot-low-cost-hardware'],
    provenance: {
      source: 'scrape',
      sourceNote: `${FUNDING}; nova-ahmed-personal-site/awards.md — "Funding". PI affiliation from the Proposal's "Katarzina Sawar, Cardiff University" collaborator entry (spelling differs).`,
    },
  },
  {
    id: 'ctrg-23-seps-02-credit-scoring',
    slug: 'ctrg-23-seps-02-credit-scoring',
    title: 'Alternative credit scoring exploration',
    funder: 'nsu',
    funderLabel: 'NSU CTRG (CTRG-23-SEPS-02)',
    amountValue: 499000,
    amountCurrency: 'BDT',
    startDate: '2023',
    endDate: '2024',
    investigators: [{ teamMember: 'nova-ahmed', role: 'pi' }],
    themes: ['ictd'],
    provenance: { source: 'scrape', sourceNote: FUNDING },
  },
  {
    id: 'ctrg-autism-tech-development',
    slug: 'ctrg-autism-tech-development',
    title: 'Exploring tech development for children with autism',
    funder: 'nsu',
    funderLabel: 'NSU CTRG',
    amountValue: 499000,
    amountCurrency: 'BDT',
    startDate: '2021',
    endDate: '2022',
    investigators: [{ teamMember: 'nova-ahmed', role: 'pi' }],
    themes: ['accessibility-inclusion'],
    provenance: { source: 'scrape', sourceNote: FUNDING },
  },
  {
    id: 'uiu-nsu-app-usage-mental-health',
    slug: 'uiu-nsu-app-usage-mental-health',
    title: 'Understanding mental health from app usage data',
    funder: 'uiu',
    funderLabel: 'UIU-NSU Collaborative Grant',
    amountValue: 499000,
    amountCurrency: 'BDT',
    startDate: '2021',
    endDate: '2022',
    investigators: [
      { teamMember: 'nova-ahmed', role: 'pi' },
      { teamMember: 'salekul-islam', role: 'co-pi' },
    ],
    themes: ['mental-health-wellbeing', 'explainable-ai-ml'],
    provenance: {
      source: 'scrape',
      sourceNote: `${FUNDING}. Possibly the same award as the Mon Majhi grant below, but title, amount, and year differ; not merged.`,
    },
  },
  {
    id: 'ctrg-emotion-from-text',
    slug: 'ctrg-emotion-from-text',
    title: 'Exploring emotion from text data',
    funder: 'nsu',
    funderLabel: 'NSU CTRG',
    amountValue: null,
    amountCurrency: 'BDT',
    amountLabel: '2,00.000',
    startDate: '2021',
    endDate: '2022',
    investigators: [
      { teamMember: 'silvia-ahmed', role: 'pi' },
      { teamMember: 'nova-ahmed', role: 'co-pi' },
    ],
    themes: ['explainable-ai-ml'],
    provenance: {
      source: 'scrape',
      sourceNote: `${FUNDING} (amount punctuation preserved as captured)`,
    },
  },
  {
    id: 'cps-sipg-dating-sites',
    slug: 'cps-sipg-dating-sites',
    title: 'Nobody can see us, exploring dating sites',
    funder: 'sipg',
    funderLabel: 'CPS-SIPG (NSU)',
    amountValue: 200000,
    amountCurrency: 'BDT',
    startDate: '2021',
    endDate: '2022',
    investigators: [
      { teamMember: 'abdul-wohab', role: 'pi' },
      { teamMember: 'nova-ahmed', role: 'co-pi' },
    ],
    themes: ['gender-feminist-hci', 'safety-security'],
    provenance: { source: 'scrape', sourceNote: FUNDING },
  },
  {
    id: 'bdosn-technology-for-women',
    slug: 'bdosn-technology-for-women',
    title: 'Technology usage for women',
    funder: 'bdosn',
    funderLabel: 'BDOSN',
    amountValue: 100000,
    amountCurrency: 'BDT',
    startDate: '2021',
    endDate: '2022',
    investigators: [{ teamMember: 'rahat-jahangir-rony', role: 'pi' }],
    themes: ['gender-feminist-hci', 'computing-education-community'],
    provenance: { source: 'scrape', sourceNote: FUNDING },
  },
  {
    id: 'google-next-billion-users',
    slug: 'google-next-billion-users',
    title: 'Technology challenges for the next billion users Bangladesh',
    funder: 'google',
    funderLabel: 'Google',
    // Conflict: the Proposal says "10,00,000 ($10,000 USD)"; the personal site
    // says "Next Billion Users Project, Google, 2017, funding of 12000 USD".
    amountValue: null,
    amountCurrency: 'USD',
    amountLabel: '$10,000 (Proposal) / $12,000 (personal site)',
    startDate: '2017',
    endDate: '2018',
    investigators: [{ teamMember: 'nova-ahmed', role: 'pi' }],
    themes: ['gender-feminist-hci', 'safety-security'],
    featured: true,
    provenance: { source: 'scrape', sourceNote: `${FUNDING} (raw role label "Lead")` },
  },
  {
    id: 'bracu-garment-industry',
    slug: 'bracu-garment-industry',
    title: 'Technology usage in the garment industry',
    funder: 'bracu',
    funderLabel: 'BRACU',
    amountValue: 100000,
    amountCurrency: 'BDT',
    startDate: '2020',
    endDate: '2021',
    investigators: [{ teamMember: 'nova-ahmed', role: 'pi' }],
    themes: ['ictd'],
    provenance: {
      source: 'scrape',
      sourceNote: `${FUNDING}; nsu-hci-current-website/awards.md lists "BRAC CED Research Grant - 2020".`,
    },
  },
  {
    id: 'nsu-uiu-xml-psychological-problems',
    slug: 'nsu-uiu-xml-psychological-problems',
    title:
      'A Real-Time Approach to Identify Psychological Problems Unobtrusively Through Explainable Machine Learning Model',
    funder: null,
    funderLabel: 'North South University and United International University',
    amountValue: 499500,
    amountCurrency: 'BDT',
    startDate: '2022',
    investigators: [
      { teamMember: 'nova-ahmed', role: 'pi' },
      { teamMember: 'salekul-islam', role: 'co-pi' },
    ],
    themes: ['mental-health-wellbeing', 'explainable-ai-ml'],
    provenance: {
      source: 'scrape',
      sourceNote:
        'nova-ahmed-personal-site/research-mental-health-with-mon-majhi.md — "Fund" (co-PI given as "Prof. Salekul Islam, UIU")',
    },
  },
  {
    id: 'nsu-bap-re-bap-seed',
    slug: 'nsu-bap-re-bap-seed',
    title: 'Bap re Bap initial seed fund',
    funder: 'nsu',
    funderLabel: 'North South University',
    investigators: [
      { customInvestigator: { name: 'Mirza Md. Lutfe Elahi', affiliation: 'nsu' }, role: 'pi' },
    ],
    themes: ['iot-low-cost-hardware'],
    provenance: {
      source: 'scrape',
      sourceNote:
        'nova-ahmed-personal-site/research-bap-re-bap.md — "Bap re Bap" (no amount or date)',
    },
  },
  {
    id: 'nsu-shonabondhu',
    slug: 'nsu-shonabondhu',
    title: 'Shonabondhu research grant',
    funder: 'nsu',
    funderLabel: 'North South University',
    amountValue: null,
    amountCurrency: 'BDT',
    amountLabel: 'BDT 4 Lac',
    investigators: [
      { customInvestigator: { name: 'Sirajul Islam', affiliation: 'nsu' }, role: 'pi' },
    ],
    themes: ['iot-low-cost-hardware'],
    provenance: {
      source: 'scrape',
      sourceNote: 'nova-ahmed-personal-site/research-project-shonabondhu.md — "Funding" (no date)',
    },
  },
  {
    id: 'systers-shonabondhu',
    slug: 'systers-shonabondhu',
    title: 'Systers Grant',
    funder: 'systers',
    funderLabel: 'Systers',
    amountValue: 800,
    amountCurrency: 'USD',
    investigators: [{ teamMember: 'nova-ahmed', role: 'pi' }],
    themes: ['iot-low-cost-hardware'],
    provenance: {
      source: 'scrape',
      sourceNote:
        'nova-ahmed-personal-site/research-project-shonabondhu.md — "Funding" (no date). The personal funding list instead has "Systers Anita Borg Pass It On Award, 2015, USD 1000"; unresolved.',
    },
  },
  {
    id: 'gdn-infodemic-detection',
    slug: 'gdn-infodemic-detection',
    title: 'Assessing Infodemic in the Post COVID-19 Risk Communication and Governance',
    funder: 'gdn',
    funderLabel: 'GDN',
    amountValue: 20000,
    amountCurrency: 'USD',
    investigators: [
      { customInvestigator: { name: 'Shabana Khan' }, role: 'pi' },
      { customInvestigator: { name: 'Jyoti Misra' }, role: 'pi' },
      { teamMember: 'nova-ahmed', role: 'pi' },
    ],
    themes: ['infodemic-misinformation'],
    provenance: {
      source: 'scrape',
      sourceNote:
        'DIAL Proposal.md — "Infodemic Detection" ("GDN funding, USD 20,000"; leads Dr. Shabana Khan, Dr. Jyoti Misra, Dr. Nova Ahmed). Not in the funding table; no dates.',
    },
  },
]
