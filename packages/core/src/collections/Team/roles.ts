/**
 * A Team Member's `role`. The stored values are permanent: production rows hold
 * them, and ADR-0002 makes `role` alone decide a Team Member's group on the site.
 * Relabel freely; never rename a value.
 *
 * DIAL's own values (`graduate-ra`, `research-staff`, …) stay as they are. The
 * generic ones a typical Lab needs on day one (postdoc, PhD and master's
 * students, visiting researchers, non-research staff) sit alongside them.
 * `staff` is deliberately separate from `research-staff`: a lab manager or
 * administrator is not a researcher, and a site lists them apart.
 */
export const TEAM_ROLES = [
  { label: 'Director', value: 'director' },
  { label: 'Faculty Member', value: 'faculty' },
  { label: 'Postdoc', value: 'postdoc' },
  { label: 'Research Staff', value: 'research-staff' },
  { label: 'PhD Student', value: 'phd-student' },
  { label: "Master's Student", value: 'masters-student' },
  { label: 'Graduate RA', value: 'graduate-ra' },
  { label: 'Undergraduate RA', value: 'undergraduate-ra' },
  { label: 'Visiting Researcher', value: 'visiting' },
  { label: 'Staff (lab manager, administration)', value: 'staff' },
  { label: 'Alumni', value: 'alumni' },
  { label: 'Interdisciplinary Collaborator', value: 'interdisciplinary-collaborator' },
  { label: 'External Collaborator', value: 'external-collaborator' },
] as const

export type TeamRoleValue = (typeof TEAM_ROLES)[number]['value']

/** What an alum was while in the Lab: every role except `alumni` itself. */
export const ALUMNI_ROLES = TEAM_ROLES.filter((role) => role.value !== 'alumni')

export const TEAM_ROLE_LABELS: Record<string, string> = Object.fromEntries(
  TEAM_ROLES.map((role) => [role.value, role.label]),
)
