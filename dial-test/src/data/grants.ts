import type { Grant } from './types'

/**
 * Fixture grants: a small, hand-picked subset chosen to cover edge cases
 * (see ./index.ts). Edit freely — this is test data, not DIAL's record.
 * The full scraped set is archived in labs/dial/dial-test-full-data/.
 */
export const grants: Grant[] = [
  {
    id: "nsu-uiu-xml-psychological-problems",
    slug: "nsu-uiu-xml-psychological-problems",
    title: "A Real-Time Approach to Identify Psychological Problems Unobtrusively Through Explainable Machine Learning Model",
    funder: null,
    funderLabel: "North South University and United International University",
    amountValue: 499500,
    amountCurrency: "BDT",
    startDate: "2022",
    investigators: [
      {
        teamMember: "nova-ahmed",
        role: "pi"
      },
      {
        teamMember: "salekul-islam",
        role: "co-pi"
      }
    ],
    themes: [
      "mental-health-wellbeing",
      "explainable-ai-ml"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/research-mental-health-with-mon-majhi.md — \"Fund\" (co-PI given as \"Prof. Salekul Islam, UIU\")"
    }
  },
  {
    id: "ctrg-autism-tech-development",
    slug: "ctrg-autism-tech-development",
    title: "Exploring tech development for children with autism",
    funder: "nsu",
    funderLabel: "NSU CTRG",
    amountValue: 499000,
    amountCurrency: "BDT",
    startDate: "2021",
    endDate: "2022",
    investigators: [
      {
        teamMember: "nova-ahmed",
        role: "pi"
      }
    ],
    themes: [
      "accessibility-inclusion"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Funding Information\""
    }
  },
  {
    id: "ctrg-22-seps-01-autism-parent-teacher",
    slug: "ctrg-22-seps-01-autism-parent-teacher",
    title: "Exploring parent-teacher challenges for children with Autism",
    funder: "nsu",
    funderLabel: "NSU CTRG (CTRG-22-SEPS-01)",
    amountValue: 499999,
    amountCurrency: "BDT",
    startDate: "2022",
    endDate: "2023",
    investigators: [
      {
        teamMember: "nova-ahmed",
        role: "pi"
      },
      {
        teamMember: "shameem-ahmed",
        role: "co-pi"
      }
    ],
    themes: [
      "accessibility-inclusion"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Funding Information\""
    }
  },
  {
    id: "nsu-bap-re-bap-seed",
    slug: "nsu-bap-re-bap-seed",
    title: "Bap re Bap initial seed fund",
    funder: "nsu",
    funderLabel: "North South University",
    investigators: [
      {
        customInvestigator: {
          name: "Mirza Md. Lutfe Elahi",
          affiliation: "nsu"
        },
        role: "pi"
      }
    ],
    themes: [
      "iot-low-cost-hardware"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/research-bap-re-bap.md — \"Bap re Bap\" (no amount or date)"
    }
  },
  {
    id: "gates-fintech-barriers",
    slug: "gates-fintech-barriers",
    title: "Understanding technology and fintech barriers for women and marginal ones",
    funder: "gates-foundation",
    funderLabel: "Bill and Melinda Gates Foundation",
    amountValue: 231000,
    amountCurrency: "USD",
    amountLabel: "2,00,97,000 BDT ($231,000)",
    startDate: "2020",
    endDate: "2022",
    investigators: [
      {
        teamMember: "nova-ahmed",
        role: "pi"
      }
    ],
    themes: [
      "gender-feminist-hci",
      "ictd"
    ],
    featured: true,
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Funding Information\"; amount confirmed by nova-ahmed-personal-site/awards.md — \"Funding\""
    }
  },
  {
    id: "bdosn-technology-for-women",
    slug: "bdosn-technology-for-women",
    title: "Technology usage for women",
    funder: "bdosn",
    funderLabel: "BDOSN",
    amountValue: 100000,
    amountCurrency: "BDT",
    startDate: "2021",
    endDate: "2022",
    investigators: [
      {
        teamMember: "rahat-jahangir-rony",
        role: "pi"
      }
    ],
    themes: [
      "gender-feminist-hci",
      "computing-education-community"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Funding Information\""
    }
  }
]
