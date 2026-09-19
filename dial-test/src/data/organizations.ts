import type { Organization } from './types'

/**
 * Fixture organizations: a small, hand-picked subset chosen to cover edge cases
 * (see ./index.ts). Edit freely — this is test data, not DIAL's record.
 * The full scraped set is archived in labs/dial/dial-test-full-data/.
 */
export const organizations: Organization[] = [
  {
    id: "nsu",
    name: "North South University",
    shortName: "NSU",
    country: "Bangladesh",
    type: "university",
    url: "http://www.northsouth.edu/",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/contact-us.md — \"Design Inclusion and Access Lab (DIAL)\"; URL from nova-ahmed-personal-site/home.md"
    }
  },
  {
    id: "gates-foundation",
    name: "Bill and Melinda Gates Foundation",
    shortName: "Gates Foundation",
    type: "funding-agency",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Funding Information\"; nsu-hci-current-website/awards.md — \"Research Grants, Funding, and Awards\""
    }
  },
  {
    id: "google",
    name: "Google",
    country: "USA",
    type: "company",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\"; nsu-hci-current-website/awards.md — \"Research Grants, Funding, and Awards\""
    }
  },
  {
    id: "bracu",
    name: "BRAC University",
    shortName: "BRACU",
    country: "Bangladesh",
    type: "university",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\" (\"National Level Collaboration\")"
    }
  },
  {
    id: "bdosn",
    name: "Bangladesh Open Source Network",
    shortName: "BDOSN",
    country: "Bangladesh",
    type: "other",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\" (\"National Level Collaboration\")"
    }
  },
  {
    id: "cardiff-university",
    name: "Cardiff University",
    country: "UK",
    type: "university",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\" (\"International Collaboration\")"
    }
  },
  {
    id: "university-of-leeds",
    name: "University of Leeds",
    country: "UK",
    type: "university",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\" (\"International Collaboration\")"
    }
  },
  {
    id: "birmingham-university",
    name: "Birmingham University",
    country: "UK",
    type: "university",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\" (\"International Collaboration\")"
    }
  },
  {
    id: "western-washington-university",
    name: "Western Washington University",
    shortName: "WWU",
    country: "USA",
    type: "university",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\" (\"International Collaboration\")"
    }
  },
  {
    id: "nsf",
    name: "National Science Foundation",
    shortName: "NSF",
    country: "USA",
    type: "funding-agency",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\" (\"International Collaboration\")"
    }
  },
  {
    id: "acm-sigchi",
    name: "ACM SIGCHI",
    country: "USA",
    type: "other",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Collaborator List\" (\"International Collaboration\")"
    }
  },
  {
    id: "university-of-louisiana-at-lafayette",
    name: "University of Louisiana at Lafayette",
    country: "USA",
    type: "university",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers\" (Dr. Tamanna Motahar)"
    }
  }
]

/** Drives the home page's collaborator strip. */
export const collaboratingOrganizationIds: string[] = [
  "acm-sigchi",
  "university-of-leeds",
  "cardiff-university",
  "birmingham-university",
  "western-washington-university",
  "nsf",
  "google",
  "bdosn",
  "bracu"
]

/** The home page's "In collaboration with" strip, in display order. */
export const homePartnerOrganizationIds: string[] = [
  "nsu",
  "google",
  "gates-foundation",
  "acm-sigchi",
  "cardiff-university",
  "bracu"
]
