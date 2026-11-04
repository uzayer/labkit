/**
 * Seeds a fictional "Example Lab" so the default Lab site can be demoed:
 *
 *   bun run payload -- run scripts/seed-demo.ts
 *
 * Everything here is invented: the people, the institutions, the venues and
 * the publications (none has a DOI). Every Feature is switched on, and the
 * Contact form the contact page submits to is created.
 *
 * Idempotent: it does nothing when the Lab already has Team Members or
 * Publications, so it never mixes demo records into a real Lab's data.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { textToLexical } from '@labkit/core/ingestion/lexical'

// Trusted server work: access control is skipped, and core's revalidation
// hooks are told there is no Next.js cache to revalidate.
const options = { overrideAccess: true, context: { disableRevalidate: true } } as const

// Plain-text paragraphs as a rich text value. Cast because each field's
// generated type lists the nodes its editor allows; paragraphs fit every one.
const lexical = (text: string) => textToLexical(text) as never

async function main() {
  const payload = await getPayload({ config })

  const [team, publications] = await Promise.all([
    payload.count({ collection: 'team', ...options }),
    payload.count({ collection: 'publications', ...options }),
  ])
  if (team.totalDocs > 0 || publications.totalDocs > 0) {
    payload.logger.info(
      `seed-demo: skipped. This Lab already has ${team.totalDocs} Team Members and ${publications.totalDocs} Publications.`,
    )
    return
  }

  const create = async <T extends Parameters<typeof payload.create>[0]['collection']>(
    collection: T,
    data: Record<string, unknown>,
  ) => {
    // The generated types are per collection; the fixtures below are checked by
    // the run itself, which fails loudly on a missing required field.
    const doc = await payload.create({ collection, data: data as never, ...options })
    return doc.id
  }

  // ─── Organizations and Venues ────────────────────────────────────────────
  const university = await create('organizations', {
    name: 'Example University',
    shortName: 'EU',
    country: 'Exampleland',
    type: 'university',
    url: 'https://example.org',
  })
  const institute = await create('organizations', {
    name: 'Example Institute of Technology',
    shortName: 'EIT',
    country: 'Exampleland',
    type: 'research-institute',
    url: 'https://example.net',
  })
  const foundation = await create('organizations', {
    name: 'Example Science Foundation',
    shortName: 'ESF',
    country: 'Exampleland',
    type: 'funding-agency',
  })
  const conference = await create('venues', {
    name: 'Proceedings of the Example Conference on Human Factors',
    shortName: 'ExampleCHI',
    type: 'conference',
  })
  const journal = await create('venues', {
    name: 'Journal of Example Interaction Studies',
    shortName: 'JEIS',
    type: 'journal',
  })

  // ─── Research Themes ──────────────────────────────────────────────────────
  const themeAccess = await create('research-themes', {
    title: 'Accessible Interfaces',
    shortDescription: 'Interfaces that work for people with a range of abilities.',
    body: lexical(
      'We study how people with visual and motor impairments use everyday software, and build tools that adapt to them.\n\nThis work runs from interviews and diary studies to prototypes tested in homes and classrooms.',
    ),
    featured: true,
  })
  const themeCivic = await create('research-themes', {
    title: 'Civic Technology',
    shortDescription: 'Software for local services and the communities that use them.',
    body: lexical(
      'We work with community groups and local services on tools for reporting problems, sharing information and making decisions together.',
    ),
    featured: true,
  })
  const themeLearning = await create('research-themes', {
    title: 'Learning Technologies',
    shortDescription: 'How students and teachers learn with and about computing.',
    body: lexical(
      'We design and evaluate tools for computing education, with a focus on first-generation university students.',
    ),
    featured: true,
  })

  // ─── Team ─────────────────────────────────────────────────────────────────
  // `name` is passed, not left to the hook that derives it, because the slug is
  // formatted from `name` before that hook runs.
  const person = (data: { firstName: string; lastName: string } & Record<string, unknown>) =>
    create('team', {
      source: 'manual',
      displayInWebsite: true,
      name: `${data.firstName} ${data.lastName}`,
      ...data,
    })

  const director = await person({
    firstName: 'Rowan',
    lastName: 'Pike',
    title: 'Professor and Lab Director',
    role: 'director',
    affiliation: university,
    email: 'rowan.pike@example.org',
    researchInterests: ['Accessibility', 'Participatory design', 'Civic technology'],
    bio: lexical(
      'Rowan Pike founded the Example Lab to study how software can serve people it usually leaves out.\n\nRowan teaches the department’s human-computer interaction courses.',
    ),
    startYear: 2015,
  })
  const postdoc = await person({
    firstName: 'Imani',
    lastName: 'Sato',
    title: 'Postdoctoral Researcher',
    role: 'postdoc',
    affiliation: university,
    researchInterests: ['Screen readers', 'Mobile accessibility'],
    bio: lexical('Imani works on accessible mobile interfaces.'),
    startYear: 2023,
  })
  const phd = await person({
    firstName: 'Tomás',
    lastName: 'Reyes',
    title: 'PhD Student',
    role: 'phd-student',
    affiliation: university,
    researchInterests: ['Civic technology', 'Community informatics'],
    startYear: 2022,
  })
  const masters = await person({
    firstName: 'Lena',
    lastName: 'Okafor',
    title: "Master's Student",
    role: 'masters-student',
    affiliation: university,
    startYear: 2024,
  })
  const undergrad = await person({
    firstName: 'Priya',
    lastName: 'Nair',
    title: 'Undergraduate Research Assistant',
    role: 'undergraduate-ra',
    affiliation: university,
    startYear: 2025,
  })
  const collaborator = await person({
    firstName: 'Marcus',
    lastName: 'Lindqvist',
    title: 'Associate Professor',
    role: 'external-collaborator',
    affiliation: institute,
  })
  await person({
    firstName: 'Ada',
    lastName: 'Brennan',
    title: 'PhD, Example University',
    role: 'alumni',
    alumniRole: 'phd-student',
    alumniYear: 2024,
    currentPosition: 'Assistant Professor, Example Institute of Technology',
    startYear: 2019,
  })
  // A co-author in the publication graph who isn't shown on the site, the way
  // ingestion creates unmatched co-authors.
  const hiddenCoauthor = await person({
    firstName: 'Jun',
    lastName: 'Park',
    title: 'Co-author',
    role: 'external-collaborator',
    affiliationLabel: 'Example Polytechnic',
    displayInWebsite: false,
    source: 'import',
  })

  // ─── Awards (Publications own their Awards, so these come first) ──────────
  const bestPaper = await create('awards', {
    title: 'Best Paper Award, ExampleCHI 2025',
    year: 2025,
    category: 'best-paper',
    scope: 'lab',
    recipients: [{ teamMember: postdoc }, { teamMember: director }],
    organizationLabel: 'Example Conference on Human Factors',
  })
  await create('awards', {
    title: 'Early Career Fellowship',
    year: 2024,
    endYear: 2027,
    category: 'fellowship',
    scope: 'personal',
    recipients: [{ teamMember: phd }],
    organization: foundation,
  })

  // ─── Publications ─────────────────────────────────────────────────────────
  const author = (teamMember: string) => ({ teamMember })
  const custom = (name: string, affiliationLabel: string) => ({
    customAuthor: { name, affiliationLabel },
  })
  const publication = (data: Record<string, unknown>) =>
    create('publications', {
      status: 'published',
      displayInWebsite: true,
      provenance: { source: 'manual' },
      ...data,
    })

  const pubScreenReaders = await publication({
    title: 'Listening Between the Lines: How Screen Reader Users Skim Long Documents',
    year: 2025,
    publicationDate: '2025-05-12',
    type: 'conference',
    venue: conference,
    location: 'Example City',
    pageStart: '1',
    pageEnd: '14',
    authors: [
      author(postdoc),
      author(masters),
      custom('Sam Ortega', 'Example Polytechnic'),
      author(director),
    ],
    abstract:
      'Screen reader users skim long documents in ways sighted readers rarely notice. We interviewed and observed participants as they worked through reports and found three skimming strategies, each poorly supported by current software.',
    keywords: ['screen readers', 'skimming', 'accessibility'],
    themes: [themeAccess],
    awards: [bestPaper],
    isOpenAccess: true,
    featured: true,
  })
  const pubCivic = await publication({
    title: 'Reporting Potholes Together: Collective Issue Reporting in a Mid-Sized City',
    year: 2024,
    publicationDate: '2024-09-03',
    type: 'journal',
    venue: journal,
    volume: '12',
    issue: '3',
    pageStart: '45',
    pageEnd: '71',
    authors: [author(phd), author(hiddenCoauthor), author(director)],
    abstract:
      'We deployed a shared issue-reporting tool with three neighbourhood associations for a year. Residents reported more, and more precisely, when they could see and build on each other’s reports.',
    keywords: ['civic technology', 'issue reporting'],
    themes: [themeCivic],
    featured: true,
  })
  const pubPreprint = await publication({
    title: 'First-Generation Students and the Hidden Curriculum of Programming Courses',
    year: 2025,
    type: 'preprint',
    status: 'preprint',
    venueLabel: 'Example Preprint Server',
    authors: [author(undergrad), author(collaborator), author(director)],
    abstract:
      'First-generation students meet unwritten expectations in introductory programming courses. We surveyed students across two universities and describe the expectations they found hardest to learn.',
    themes: [themeLearning],
  })
  await publication({
    title: 'A Workshop on Designing With, Not For, Community Groups',
    year: 2023,
    type: 'workshop',
    venueLabel: 'Example Workshop on Participatory Design',
    authors: [author(director), custom('Hana Kowalski', 'Example Community Trust')],
    themes: [themeCivic],
  })
  await publication({
    title: 'Adaptive Touch Targets for Users with Tremor',
    year: 2023,
    publicationDate: '2023-04-20',
    type: 'conference',
    venue: conference,
    status: 'published',
    authors: [author(director), custom('Ada Brennan', 'Example University')],
    abstract:
      'Touch targets that grow with a user’s measured tremor cut mis-taps by a third in a two-week field study, without making the interface feel crowded.',
    themes: [themeAccess],
    links: [{ type: 'code', url: 'https://example.org/code/adaptive-targets' }],
  })
  await publication({
    title: 'Peer Tutoring at Scale in Introductory Computing',
    year: 2026,
    type: 'journal',
    status: 'accepted-in-press',
    venue: journal,
    authors: [author(masters), author(director)],
    themes: [themeLearning],
  })

  // ─── Grants ───────────────────────────────────────────────────────────────
  const grantAccess = await create('grants', {
    title: 'Accessible Reading Tools for Long Documents',
    description: 'Builds and evaluates skimming support for screen reader users.',
    funder: foundation,
    grantNumber: 'ESF-2024-0117',
    amountValue: 450000,
    amountCurrency: 'USD',
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    status: 'active',
    investigators: [
      { teamMember: director, role: 'pi' },
      { teamMember: postdoc, role: 'supported' },
    ],
    themes: [themeAccess],
  })
  await create('grants', {
    title: 'Neighbourhood Data Commons',
    funderLabel: 'Example City Council',
    amountLabel: 'Seed funding',
    startDate: '2022-06-01',
    endDate: '2024-05-31',
    status: 'completed',
    investigators: [
      { teamMember: director, role: 'pi' },
      { customInvestigator: { name: 'Hana Kowalski' }, role: 'collaborator' },
    ],
    themes: [themeCivic],
  })

  // ─── Projects (published, so the site shows them) ─────────────────────────
  await payload.create({
    collection: 'projects',
    draft: false,
    data: {
      title: 'SkimKit',
      abstract: 'Tools that help screen reader users skim long documents.',
      status: 'ongoing',
      startDate: '2024-01-01',
      teamMembers: [director, postdoc, masters],
      themes: [themeAccess],
      publications: [pubScreenReaders],
      grants: [grantAccess],
      awards: [bestPaper],
      content: lexical(
        'SkimKit grew out of our interviews with screen reader users. It adds headings, summaries and landmarks to documents that have none.',
      ),
      featured: true,
      _status: 'published',
    },
    ...options,
  })
  await payload.create({
    collection: 'projects',
    draft: false,
    data: {
      title: 'Neighbourhood Reports',
      abstract: 'A shared issue-reporting tool built with neighbourhood associations.',
      status: 'completed',
      startDate: '2022-06-01',
      endDate: '2024-05-31',
      teamMembers: [director, phd],
      themes: [themeCivic],
      publications: [pubCivic],
      _status: 'published',
    },
    ...options,
  })
  await payload.create({
    collection: 'projects',
    draft: false,
    data: {
      title: 'Open Doors to Computing',
      abstract:
        'Studying and supporting first-generation students in their first programming course.',
      status: 'ongoing',
      startDate: '2025-01-01',
      teamMembers: [director, undergrad],
      themes: [themeLearning],
      publications: [pubPreprint],
      _status: 'published',
    },
    ...options,
  })

  // ─── News Items (each date only as precise as it is known) ───────────────
  const news = [
    {
      title: 'Best Paper Award at ExampleCHI 2025',
      date: '2025-05-14',
      datePrecision: 'day',
      type: 'academic',
      description:
        'Our paper on how screen reader users skim long documents received a Best Paper Award.',
    },
    {
      title: 'Open lab day for prospective students',
      date: '2025-03-01',
      datePrecision: 'month',
      type: 'event',
      description: 'Prospective students visited the lab, tried our prototypes and met the team.',
    },
    {
      title: 'Neighbourhood Reports wraps up',
      date: '2024-01-01',
      datePrecision: 'year',
      type: 'community',
      description:
        'After two years with three neighbourhood associations, the Neighbourhood Reports project has finished. The tool stays with the associations.',
    },
  ]
  for (const item of news) await create('news', item)

  // ─── Lab Info, Features and the Contact form ──────────────────────────────
  await payload.updateGlobal({
    slug: 'lab-info',
    data: {
      name: 'Example Lab',
      shortName: 'Example Lab',
      description:
        'A fictional human-computer interaction lab, seeded to demo the LabKit site. None of its people, papers or institutions exist.',
      headline: 'Software for the people it usually leaves out.',
      intro:
        'The Example Lab studies how people with different abilities and in different communities use technology, then builds tools with them. Everything on this demo site is invented.',
      about: lexical(
        'The Example Lab is a fictional research group, created to show what a LabKit site looks like with records in it.\n\nIts people, publications, projects and grants are all invented, and none has a DOI or a real-world counterpart.',
      ),
      joinUs: lexical(
        'We take students at every level. Write to us with a short note on what you would like to work on and a CV.\n\nNo prior research experience is needed.',
      ),
      parentOrganization: {
        name: 'Example University',
        url: 'https://example.org',
        department: 'Department of Computing',
      },
      email: 'lab@example.org',
      location: { city: 'Example City', country: 'Exampleland' },
      foundingDate: '2015-09-01',
      homePartners: [institute, foundation],
      collaborators: [institute],
      recruitment: { opens: '2026-01-01', closes: '2026-12-31' },
      socials: [{ platform: 'github', url: 'https://github.com/example' }],
    },
    ...options,
  })

  await payload.updateGlobal({
    slug: 'features',
    data: { projects: true, grants: true, awards: true, newsItems: true, researchThemes: true },
    ...options,
  })

  await payload.create({
    collection: 'forms',
    data: {
      title: 'Contact',
      fields: [
        { blockType: 'text', name: 'name', label: 'Name', required: true },
        { blockType: 'email', name: 'email', label: 'Email', required: true },
        { blockType: 'textarea', name: 'message', label: 'Message', required: true },
      ],
      confirmationType: 'message',
      confirmationMessage: lexical('Thank you. We will be in touch soon.'),
    },
    ...options,
  })

  payload.logger.info('seed-demo: seeded the Example Lab.')
}

await main().catch((error) => {
  console.error(error)
  process.exit(1)
})
process.exit(0)
