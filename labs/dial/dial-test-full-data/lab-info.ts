import type { LabInfo } from './types'

/**
 * Lab identity and contact details. Name and PI are confirmed (see
 * labs/dial/identity.md); everything else is as captured and still needs DIAL
 * confirmation — in particular the contact email (it is the shared NSUHCI
 * mailbox), the social accounts (labelled "Follow NSUHCI"), and the founding
 * year.
 */
export const labInfo: LabInfo = {
  name: 'Design Inclusion and Access Lab',
  shortName: 'DIAL',
  institution: 'North South University',
  tagline: 'Focusing specifically on technology design, inclusion, and access.',
  email: 'nsuhci.research@gmail.com',
  address: 'SAC 1060, 10th floor, ECE Dept., North South University, Bashundhara R/A, Dhaka 1229',
  socials: [
    { platform: 'x', url: 'https://twitter.com/NSUHCI_DIAL' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/nsuhcidial/' },
    { platform: 'facebook', url: 'https://www.facebook.com/Research.NSUHCI' },
  ],
  foundedYear: 2020,
  hciResearchSince: 2017,
  parentGroup: 'North South University Human Computer Interaction (NSUHCI)',
  recruitment: { opens: '2026-01-01', closes: '2026-01-30' },
  provenance: {
    source: 'scrape',
    sourceNote:
      'nsu-hci-current-website/home.md — "North South University HCI Research - DIAL" (founding: "In 2020, NSUHCI established a lab named DIAL"; "NSUHCI started focusing on HCI research in 2017"; tagline phrase; "Upcoming Recruitments: January 1, 2026 - January 30, 2026"); contact-us.md — "Contact Us" (email, address); socials from the "Follow NSUHCI" footer links.',
  },
}
