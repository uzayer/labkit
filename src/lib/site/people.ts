import type { Team } from '@/payload-types'

/**
 * The People page's groups, in page order. `role` alone decides a Team
 * Member's group (ADR-0002), so this list is the whole rule: edit the titles,
 * order or grouping to suit the Lab. A role missing from every group is not
 * shown on the People page, though the person keeps their own page.
 */
export const PEOPLE_GROUPS: { title: string; roles: Team['role'][] }[] = [
  { title: 'Leadership', roles: ['director'] },
  { title: 'Faculty and researchers', roles: ['faculty', 'postdoc', 'research-staff', 'visiting'] },
  { title: 'Graduate students', roles: ['phd-student', 'masters-student', 'graduate-ra'] },
  { title: 'Undergraduate researchers', roles: ['undergraduate-ra'] },
  { title: 'Staff', roles: ['staff'] },
  {
    title: 'Collaborators',
    roles: ['interdisciplinary-collaborator', 'external-collaborator'],
  },
  { title: 'Alumni', roles: ['alumni'] },
]

/** Within a group: in role order, then by surname. */
export function groupPeople(people: Team[]) {
  return PEOPLE_GROUPS.map((group) => ({
    title: group.title,
    members: people
      .filter((person) => group.roles.includes(person.role))
      .sort(
        (a, b) =>
          group.roles.indexOf(a.role) - group.roles.indexOf(b.role) ||
          (b.alumniYear ?? 0) - (a.alumniYear ?? 0) ||
          a.lastName.localeCompare(b.lastName),
      ),
  })).filter((group) => group.members.length > 0)
}
