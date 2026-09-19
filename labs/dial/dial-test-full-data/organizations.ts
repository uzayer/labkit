import type { Organization } from './types'

/**
 * Organizations named in the captures as funders, collaborators, or Team
 * Member affiliations. Names are as captured; no ROR IDs were supplied, and
 * acronyms are not expanded unless a capture expands them.
 */

const PROPOSAL_COLLAB = 'DIAL Proposal.md — "Collaborator List"'
const PROPOSAL_FUNDING = 'DIAL Proposal.md — "Funding Information"'
const NSU_AWARDS = 'nsu-hci-current-website/awards.md — "Research Grants, Funding, and Awards"'

export const organizations: Organization[] = [
  {
    id: 'nsu',
    name: 'North South University',
    shortName: 'NSU',
    country: 'Bangladesh',
    type: 'university',
    url: 'http://www.northsouth.edu/',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/contact-us.md — "Design Inclusion and Access Lab (DIAL)"; URL from nova-ahmed-personal-site/home.md',
    },
  },
  {
    id: 'uiu',
    name: 'United International University',
    shortName: 'UIU',
    country: 'Bangladesh',
    type: 'university',
    provenance: { source: 'scrape', sourceNote: `${PROPOSAL_COLLAB}; ${PROPOSAL_FUNDING}` },
  },
  {
    id: 'sipg',
    name: 'South Asian Institute of Policy and Governance',
    shortName: 'SIPG',
    type: 'other',
    provenance: { source: 'scrape', sourceNote: NSU_AWARDS },
  },
  {
    id: 'gates-foundation',
    name: 'Bill and Melinda Gates Foundation',
    shortName: 'Gates Foundation',
    type: 'funding-agency',
    provenance: { source: 'scrape', sourceNote: `${PROPOSAL_FUNDING}; ${NSU_AWARDS}` },
  },
  {
    id: 'google',
    name: 'Google',
    country: 'USA',
    type: 'company',
    provenance: { source: 'scrape', sourceNote: `${PROPOSAL_COLLAB}; ${NSU_AWARDS}` },
  },
  {
    id: 'ukri-gcrf',
    // The captures write both "GCRF" and "UKRI-GCRF" and never expand either.
    name: 'UKRI-GCRF',
    shortName: 'GCRF',
    type: 'funding-agency',
    provenance: { source: 'scrape', sourceNote: `${NSU_AWARDS}; ${PROPOSAL_FUNDING}` },
  },
  {
    id: 'bracu',
    // awards.md says "BRAC CED Research Grant - 2020"; the Proposal says "BRACU".
    // Their equivalence is not stated, so the label is kept on the Grant.
    name: 'BRAC University',
    shortName: 'BRACU',
    country: 'Bangladesh',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("National Level Collaboration")`,
    },
  },
  {
    id: 'bdosn',
    name: 'Bangladesh Open Source Network',
    shortName: 'BDOSN',
    country: 'Bangladesh',
    type: 'other',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("National Level Collaboration")`,
    },
  },
  {
    id: 'gdn',
    // Captured only as "GDN funding"; the acronym is not expanded.
    name: 'GDN',
    type: 'funding-agency',
    provenance: { source: 'scrape', sourceNote: 'DIAL Proposal.md — "Infodemic Detection"' },
  },
  {
    id: 'systers',
    name: 'Systers',
    type: 'other',
    provenance: {
      source: 'scrape',
      sourceNote: 'nova-ahmed-personal-site/research-project-shonabondhu.md — "Funding"',
    },
  },
  {
    id: 'cardiff-university',
    name: 'Cardiff University',
    country: 'UK',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'university-of-leeds',
    name: 'University of Leeds',
    country: 'UK',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'birmingham-university',
    name: 'Birmingham University',
    country: 'UK',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'western-washington-university',
    name: 'Western Washington University',
    shortName: 'WWU',
    country: 'USA',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'nsf',
    name: 'National Science Foundation',
    shortName: 'NSF',
    country: 'USA',
    type: 'funding-agency',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'acm-sigchi',
    name: 'ACM SIGCHI',
    country: 'USA',
    type: 'other',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'global-young-academy',
    name: 'Global Young Academy',
    country: 'Germany',
    type: 'other',
    url: 'https://globalyoungacademy.net/',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB}; nova-ahmed-personal-site/collaborations.md`,
    },
  },
  {
    id: 'iit-mumbai',
    name: 'IIT, Mumbai',
    country: 'India',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'iit-guwahati',
    name: 'IIT, Guwahati',
    country: 'India',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'microsoft-research-india',
    name: 'Microsoft Research, India',
    country: 'India',
    type: 'research-institute',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'lums',
    name: 'Lahore University of Management Sciences',
    shortName: 'LUMS',
    country: 'Pakistan',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("International Collaboration")`,
    },
  },
  {
    id: 'icddrb',
    name: 'icddr,b',
    country: 'Bangladesh',
    type: 'research-institute',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("National Level Collaboration")`,
    },
  },
  {
    id: 'ict-ministry-bangladesh',
    name: 'ICT Ministry, Bangladesh',
    country: 'Bangladesh',
    type: 'government',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("National Level Collaboration")`,
    },
  },
  {
    id: 'education-ministry-bangladesh',
    name: 'Education Ministry, Bangladesh',
    country: 'Bangladesh',
    type: 'government',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("National Level Collaboration")`,
    },
  },
  {
    id: 'british-council-bangladesh',
    name: 'British Council, Bangladesh',
    country: 'Bangladesh',
    type: 'other',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_COLLAB} ("National Level Collaboration")`,
    },
  },
  {
    id: 'grameenphone',
    name: 'Grameenphone',
    country: 'Bangladesh',
    type: 'company',
    provenance: {
      source: 'scrape',
      sourceNote: 'nova-ahmed-personal-site/collaborations.md — "Grameen Phone Collaboration"',
    },
  },
  {
    id: 'university-of-louisiana-at-lafayette',
    name: 'University of Louisiana at Lafayette',
    country: 'USA',
    type: 'university',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/people.md — "Researchers" (Dr. Tamanna Motahar)',
    },
  },
]

/**
 * Organizations the Proposal lists as DIAL collaborators ("International
 * Collaboration" and "National Level Collaboration"), in capture order. Drives
 * the home page's collaborator strip.
 */
export const collaboratingOrganizationIds: string[] = [
  'acm-sigchi',
  'university-of-leeds',
  'cardiff-university',
  'birmingham-university',
  'western-washington-university',
  'nsf',
  'google',
  'global-young-academy',
  'iit-mumbai',
  'iit-guwahati',
  'microsoft-research-india',
  'lums',
  'bdosn',
  'bracu',
  'uiu',
  'icddrb',
  'ict-ministry-bangladesh',
  'education-ministry-bangladesh',
  'british-council-bangladesh',
]

/**
 * The home page's "In collaboration with" strip: organizations named on DIAL's
 * own public-site captures (NSU home page grant list, awards page, events),
 * in display order. Needs the Lab's confirmation before launch.
 */
export const homePartnerOrganizationIds: string[] = [
  'nsu',
  'google',
  'gates-foundation',
  'acm-sigchi',
  'cardiff-university',
  'bracu',
]
