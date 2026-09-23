/**
 * What DIAL's site says about the Lab that the LabInfo global has no field
 * for: stable prose, per the roadmap's "split routes by churn" rule. LabInfo's
 * own values (name, parent organization, description, founding date) win
 * where they are set; these fill in when they are not.
 *
 * Sources (still needing DIAL confirmation, see labs/dial/identity.md):
 * nsu-hci-current-website/home.md — "In 2020, NSUHCI established a lab named
 * DIAL"; "NSUHCI started focusing on HCI research in 2017".
 */
export const DIAL_PROSE = {
  name: 'Design Inclusion and Access Lab',
  shortName: 'DIAL',
  institution: 'North South University',
  tagline: 'Focusing specifically on technology design, inclusion, and access.',
  foundedYear: 2020,
  /** Year the parent NSUHCI group began HCI research. */
  hciResearchSince: 2017,
  /** The parent research group DIAL sits inside. */
  parentGroup: 'North South University Human Computer Interaction (NSUHCI)',
} as const
