import { getPayload, type CollectionSlug, type Payload } from 'payload'
import config from '@payload-config'

import { textToLexical } from '@labkit/core/ingestion/lexical'

const SEED_PREFIX = '[seed] '
const SHOULD_WIPE = process.argv.includes('wipe')
const LAB_INFO_REVALIDATE_ERROR = 'static generation store missing in revalidatetag lab-info'

type CountMap = Record<string, number>

interface Summary {
  created: CountMap
  updated: CountMap
  deleted: CountMap
}

interface UpsertSeedDocOptions {
  payload: Payload
  collection: CollectionSlug
  field: string
  value: string
  data: Record<string, unknown>
}

interface TeamFixture {
  key: string
  firstName: string
  middleName?: string
  lastName: string
  title: string
  role: 'director' | 'faculty' | 'graduate-ra' | 'alumni' | 'external-collaborator'
  source: 'manual' | 'import'
  displayInWebsite: boolean
  bio: string
  researchInterests: string[]
  email?: string
  orcid?: string
  openalex_id?: string
  dblp_pid?: string
  affiliation?: string
  affiliationLabel?: string
  alumniYear?: number
  currentPosition?: string
  socials?: Array<{
    platform: 'google-scholar' | 'linkedin' | 'website' | 'x' | 'github'
    url: string
  }>
}

interface PublicationFixture {
  title: string
  abstract: string
  keywords: string[]
  authorKeys: string[]
  year: number
  status: 'published' | 'accepted-in-press' | 'submitted' | 'preprint'
  type:
    | 'conference'
    | 'journal'
    | 'workshop'
    | 'preprint'
    | 'extended-abstract'
    | 'study-protocol'
    | 'book-chapter'
  publicationDate?: string
  acceptanceDate?: string
  venueKey?: string
  venueLabel?: string
  location?: string
  volume?: string
  issue?: string
  pageStart?: string
  pageEnd?: string
  publisher?: string
  series?: string
  editor?: string
  citationText?: string
  doi?: string
  externalUrl?: string
  isOpenAccess?: boolean
  license?:
    | 'all-rights-reserved'
    | 'cc-by'
    | 'cc-by-sa'
    | 'cc-by-nc'
    | 'cc-by-nc-sa'
    | 'cc-by-nd'
    | 'cc-by-nc-nd'
    | 'cc0'
  featured?: boolean
  openalex_id?: string
  citationCount?: number
  citationCountUpdatedAt?: string
  bibtex?: string
  provenanceSource: 'manual' | 'crossref' | 'openalex' | 'bibtex' | 'scrape'
  provenanceImportedAt?: string
  provenanceSourceNote?: string
}

interface ReviewItemFixture {
  kind:
    | 'unmatched-venue'
    | 'unmatched-org'
    | 'person-merge-suggestion'
    | 'no-doi-work'
    | 'unparsed-citation'
    | 'unmapped-type'
    | 'failed-doi'
  status: 'open' | 'accepted' | 'dismissed'
  runKey?: 'completed' | 'staged' | 'running'
  value: string
  sourceContext: string
  data?: Record<string, unknown> | null
  resolution?: Record<string, unknown> | null
  resolvedAt?: string
}

const summary: Summary = {
  created: {},
  updated: {},
  deleted: {},
}

function increment(bucket: CountMap, key: string, amount = 1) {
  bucket[key] = (bucket[key] ?? 0) + amount
}

function seedName(name: string) {
  return `${SEED_PREFIX}${name}`
}

function seedSourceContext(text: string) {
  return `${SEED_PREFIX}${text}`
}

function getTeamFullName(fixture: Pick<TeamFixture, 'firstName' | 'middleName' | 'lastName'>) {
  return [fixture.firstName, fixture.middleName, fixture.lastName].filter(Boolean).join(' ')
}

function getTeamLookup(fixture: TeamFixture) {
  if (fixture.orcid) {
    return { field: 'orcid', value: fixture.orcid }
  }

  if (fixture.openalex_id) {
    return { field: 'openalex_id', value: fixture.openalex_id }
  }

  if (fixture.dblp_pid) {
    return { field: 'dblp_pid', value: fixture.dblp_pid }
  }

  if (fixture.email) {
    return { field: 'email', value: fixture.email }
  }

  return { field: 'name', value: getTeamFullName(fixture) }
}

async function upsertSeedDoc({
  payload,
  collection,
  field,
  value,
  data,
}: UpsertSeedDocOptions): Promise<{ id: string; action: 'created' | 'updated' }> {
  const existing = await payload.find({
    collection,
    where: {
      [field]: {
        equals: value,
      },
    } as any,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as { id: string }
    await payload.update({
      collection,
      id: doc.id,
      data,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    increment(summary.updated, collection)
    return { id: doc.id, action: 'updated' }
  }

  const created = await payload.create({
    collection,
    data,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  increment(summary.created, collection)
  return { id: (created as { id: string }).id, action: 'created' }
}

async function deleteSeedDocs(payload: Payload, collection: CollectionSlug, field: string) {
  const { docs } = await payload.find({
    collection,
    where: {
      [field]: {
        like: SEED_PREFIX,
      },
    } as any,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  for (const doc of docs as Array<{ id: string }>) {
    await payload.delete({
      collection,
      id: doc.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    increment(summary.deleted, collection)
  }
}

async function writeLabInfo(payload: Payload, data: Record<string, unknown>) {
  try {
    await payload.updateGlobal({
      slug: 'lab-info',
      data,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (!message.toLowerCase().includes(LAB_INFO_REVALIDATE_ERROR)) {
      throw error
    }
  }
}

async function resetLabInfo(payload: Payload) {
  await writeLabInfo(payload, {
    name: 'DIAL Lab',
    shortName: 'DIAL',
    description: undefined,
    parentOrganization: {
      name: 'North South University',
      url: undefined,
      department: undefined,
    },
    email: undefined,
    url: undefined,
    logo: undefined,
    location: {
      address: undefined,
      city: 'Dhaka',
      country: 'Bangladesh',
    },
    socials: [],
    identifiers: {
      ror_id: undefined,
      wikidata_id: undefined,
      openalex_id: undefined,
    },
    foundingDate: undefined,
    onboardingCompleted: false,
  })

  increment(summary.updated, 'lab-info')
}

async function wipe(payload: Payload) {
  await deleteSeedDocs(payload, 'review-items', 'sourceContext')
  await deleteSeedDocs(payload, 'import-runs', 'label')
  await deleteSeedDocs(payload, 'publications', 'title')
  await deleteSeedDocs(payload, 'team', 'title')
  await deleteSeedDocs(payload, 'venues', 'name')
  await deleteSeedDocs(payload, 'organizations', 'name')
  await resetLabInfo(payload)
}

async function seedLabInfo(payload: Payload) {
  await writeLabInfo(payload, {
    name: 'Interactive Systems and Society Lab',
    shortName: 'ISSL',
    description: seedSourceContext(
      'Human-centered computing and AI systems lab studying collaborative tools, digital inclusion, and public-interest technology.',
    ),
    parentOrganization: {
      name: 'North South University',
      url: 'https://www.northsouth.edu',
      department: 'Department of Electrical and Computer Engineering',
    },
    email: 'issl@northsouth.edu',
    url: 'https://issl.example.edu',
    location: {
      address: 'Plot 15, Block B, Bashundhara',
      city: 'Dhaka',
      country: 'Bangladesh',
    },
    socials: [
      { platform: 'github', url: 'https://github.com/issl-lab' },
      { platform: 'google-scholar', url: 'https://scholar.google.com/citations?user=isslseed' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/issl-lab/' },
    ],
    identifiers: {
      ror_id: 'https://ror.org/02f8yhm16',
      wikidata_id: 'Q124512345',
      openalex_id: 'I4210100012',
    },
    foundingDate: '2018-01-01T00:00:00.000Z',
    onboardingCompleted: true,
  })

  increment(summary.updated, 'lab-info')
}

async function seedOrganizations(payload: Payload) {
  const fixtures = [
    {
      key: 'nsu',
      name: seedName('North South University'),
      shortName: 'NSU',
      country: 'Bangladesh',
      type: 'university',
      url: 'https://www.northsouth.edu',
      ror_id: 'https://ror.org/02f8yhm16',
    },
    {
      key: 'acm',
      name: seedName('Association for Computing Machinery'),
      shortName: 'ACM',
      country: 'United States',
      type: 'publisher',
      url: 'https://www.acm.org',
    },
    {
      key: 'elsevier',
      name: seedName('Elsevier'),
      shortName: 'Elsevier',
      country: 'Netherlands',
      type: 'publisher',
      url: 'https://www.elsevier.com',
    },
    {
      key: 'uw',
      name: seedName('University of Washington'),
      shortName: 'UW',
      country: 'United States',
      type: 'university',
      url: 'https://www.washington.edu',
    },
  ] as const

  const organizationIds = new Map<string, string>()

  for (const fixture of fixtures) {
    const result = await upsertSeedDoc({
      payload,
      collection: 'organizations',
      field: 'name',
      value: fixture.name,
      data: {
        name: fixture.name,
        shortName: fixture.shortName,
        country: fixture.country,
        type: fixture.type,
        url: fixture.url,
        ror_id: 'ror_id' in fixture ? fixture.ror_id : undefined,
        provenance: {
          source: 'manual',
          importedAt: '2026-07-05T09:00:00.000Z',
          sourceNote: `${SEED_PREFIX}dashboard seed fixture`,
        },
      },
    })
    organizationIds.set(fixture.key, result.id)
  }

  return organizationIds
}

async function seedVenues(payload: Payload, organizationIds: Map<string, string>) {
  const fixtures = [
    {
      key: 'chi',
      name: seedName('ACM CHI Conference on Human Factors in Computing Systems'),
      shortName: 'CHI',
      type: 'conference',
      url: 'https://chi2024.acm.org',
      publisher: organizationIds.get('acm'),
      openalex_id: 'S4210170001',
    },
    {
      key: 'cscw',
      name: seedName('ACM Conference on Computer-Supported Cooperative Work and Social Computing'),
      shortName: 'CSCW',
      type: 'conference',
      url: 'https://cscw.acm.org',
      publisher: organizationIds.get('acm'),
      openalex_id: 'S4210170002',
    },
    {
      key: 'pacmhci',
      name: seedName('Proceedings of the ACM on Human-Computer Interaction'),
      shortName: 'PACM HCI',
      type: 'journal',
      url: 'https://pacm.acm.org',
      publisher: organizationIds.get('acm'),
      issn: ['2573-0142'],
      openalex_id: 'S4210170003',
    },
    {
      key: 'ijhcs',
      name: seedName('International Journal of Human-Computer Studies'),
      shortName: 'IJHCS',
      type: 'journal',
      url: 'https://www.sciencedirect.com/journal/international-journal-of-human-computer-studies',
      publisher: organizationIds.get('elsevier'),
      issn: ['1071-5819'],
      openalex_id: 'S4210170004',
    },
  ] as const

  const venueIds = new Map<string, string>()

  for (const fixture of fixtures) {
    const result = await upsertSeedDoc({
      payload,
      collection: 'venues',
      field: 'name',
      value: fixture.name,
      data: {
        name: fixture.name,
        shortName: fixture.shortName,
        type: fixture.type,
        url: fixture.url,
        publisher: fixture.publisher,
        issn: 'issn' in fixture ? fixture.issn : undefined,
        openalex_id: fixture.openalex_id,
      },
    })
    venueIds.set(fixture.key, result.id)
  }

  return venueIds
}

async function seedTeam(payload: Payload, organizationIds: Map<string, string>) {
  const fixtures: TeamFixture[] = [
    {
      key: 'amina-rahman',
      firstName: 'Amina',
      lastName: 'Rahman',
      title: 'Associate Professor of Computer Science',
      role: 'director',
      source: 'manual',
      displayInWebsite: true,
      bio: 'Amina leads the lab’s work on human-centered AI, research operations, and public-sector technology adoption.',
      researchInterests: ['Human-centered AI', 'ICTD', 'Research operations'],
      email: 'amina.rahman@northsouth.edu',
      orcid: '0000-0002-4871-9814',
      affiliation: organizationIds.get('nsu'),
      socials: [
        { platform: 'website', url: 'https://issl.example.edu/amina-rahman' },
        { platform: 'google-scholar', url: 'https://scholar.google.com/citations?user=aminaseed' },
      ],
    },
    {
      key: 'farhan-ahmed',
      firstName: 'Farhan',
      lastName: 'Ahmed',
      title: 'Assistant Professor of Human-Computer Interaction',
      role: 'faculty',
      source: 'manual',
      displayInWebsite: true,
      bio: 'Farhan studies collaborative systems, remote teamwork, and the social impacts of AI-assisted analysis tools.',
      researchInterests: ['CSCW', 'AI-assisted analysis', 'Digital work'],
      email: 'farhan.ahmed@northsouth.edu',
      affiliation: organizationIds.get('nsu'),
      socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/farhan-ahmed-seed/' }],
    },
    {
      key: 'nabila-sultana',
      firstName: 'Nabila',
      lastName: 'Sultana',
      title: 'Assistant Professor of Learning Sciences',
      role: 'faculty',
      source: 'manual',
      displayInWebsite: true,
      bio: 'Nabila works on learning technologies, reflective practice, and inclusive curricula for first-generation university students.',
      researchInterests: ['Learning sciences', 'AI literacy', 'Inclusive curricula'],
      email: 'nabila.sultana@northsouth.edu',
      affiliation: organizationIds.get('nsu'),
      socials: [{ platform: 'website', url: 'https://issl.example.edu/nabila-sultana' }],
    },
    {
      key: 'rafiul-karim',
      firstName: 'Rafiul',
      lastName: 'Karim',
      title: 'PhD Candidate',
      role: 'graduate-ra',
      source: 'manual',
      displayInWebsite: true,
      bio: 'Rafiul builds field research infrastructure for multilingual annotation, offline sync, and community data stewardship.',
      researchInterests: ['Offline-first systems', 'Field infrastructure', 'Data stewardship'],
      email: 'rafiul.karim@northsouth.edu',
      affiliation: organizationIds.get('nsu'),
      socials: [{ platform: 'github', url: 'https://github.com/rafiul-seed' }],
    },
    {
      key: 'samira-islam',
      firstName: 'Samira',
      lastName: 'Islam',
      title: 'MS Research Assistant',
      role: 'graduate-ra',
      source: 'manual',
      displayInWebsite: true,
      bio: 'Samira researches health communication, community reporting workflows, and trust in civic-support chatbots.',
      researchInterests: ['Health communication', 'Civic tech', 'Conversational systems'],
      email: 'samira.islam@northsouth.edu',
      affiliation: organizationIds.get('nsu'),
      socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/samira-islam-seed/' }],
    },
    {
      key: 'tasnim-chowdhury',
      firstName: 'Tasnim',
      lastName: 'Chowdhury',
      title: 'Former Undergraduate Research Assistant',
      role: 'alumni',
      source: 'manual',
      displayInWebsite: true,
      bio: 'Tasnim contributed to the lab’s early publication pipeline work and undergraduate mentorship playbooks.',
      researchInterests: ['Research tooling', 'Mentorship', 'Design methods'],
      email: 'tasnim.chowdhury@alumni.example.edu',
      affiliation: organizationIds.get('nsu'),
      alumniYear: 2024,
      currentPosition: 'Product Designer at Civic Bridge',
      socials: [
        { platform: 'linkedin', url: 'https://www.linkedin.com/in/tasnim-chowdhury-seed/' },
      ],
    },
    {
      key: 'john-smith',
      firstName: 'John',
      lastName: 'Smith',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Community informatics'],
      affiliationLabel: 'Civic Data Lab',
      openalex_id: 'A5100001001',
    },
    {
      key: 'jon-smith',
      firstName: 'Jon',
      lastName: 'Smith',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Community informatics'],
      affiliationLabel: 'Civic Data Lab',
    },
    {
      key: 'priya-natarajan',
      firstName: 'Priya',
      lastName: 'Natarajan',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Crisis informatics'],
      affiliationLabel: 'University of Washington',
      orcid: '0000-0003-1414-9901',
    },
    {
      key: 'miguel-alvarez',
      firstName: 'Miguel',
      lastName: 'Alvarez',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Participatory sensing'],
      affiliationLabel: 'Universidad de los Andes',
      openalex_id: 'A5100001002',
    },
    {
      key: 'emily-chen',
      firstName: 'Emily',
      lastName: 'Chen',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Health technologies'],
      affiliation: organizationIds.get('uw'),
      orcid: '0000-0001-5502-2103',
    },
    {
      key: 'omar-hassan',
      firstName: 'Omar',
      lastName: 'Hassan',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Digital agriculture'],
      affiliationLabel: 'Cairo University',
      dblp_pid: 'o/OmarHassan2',
    },
    {
      key: 'sara-lopez',
      firstName: 'Sara',
      lastName: 'Lopez',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Community archives'],
      affiliationLabel: 'University of Texas at Austin',
      openalex_id: 'A5100001003',
    },
    {
      key: 'chen-li',
      firstName: 'Chen',
      lastName: 'Li',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Data visualization'],
      affiliationLabel: 'Tsinghua University',
    },
    {
      key: 'fatima-noor',
      firstName: 'Fatima',
      lastName: 'Noor',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Maternal health'],
      affiliationLabel: 'BRAC James P Grant School of Public Health',
      openalex_id: 'A5100001004',
    },
    {
      key: 'daniel-wu',
      firstName: 'Daniel',
      lastName: 'Wu',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Design systems'],
      affiliationLabel: 'Georgia Institute of Technology',
      dblp_pid: 'w/DanielWu4',
    },
    {
      key: 'sofia-martinez',
      firstName: 'Sofia',
      lastName: 'Martinez',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Public-sector AI'],
      affiliationLabel: 'Universidad Nacional de Colombia',
    },
    {
      key: 'arjun-patel',
      firstName: 'Arjun',
      lastName: 'Patel',
      title: 'External Collaborator',
      role: 'external-collaborator',
      source: 'import',
      displayInWebsite: false,
      bio: 'Imported collaborator record from publication metadata.',
      researchInterests: ['Mobile systems'],
      affiliationLabel: 'Indian Institute of Science',
      openalex_id: 'A5100001005',
    },
  ]

  const teamIds = new Map<string, string>()

  for (const fixture of fixtures) {
    const name = getTeamFullName(fixture)
    const lookup = getTeamLookup(fixture)
    const result = await upsertSeedDoc({
      payload,
      collection: 'team',
      field: lookup.field,
      value: lookup.value,
      data: {
        name,
        firstName: fixture.firstName,
        middleName: fixture.middleName,
        lastName: fixture.lastName,
        title: seedName(fixture.title),
        affiliation: fixture.affiliation,
        affiliationLabel: fixture.affiliationLabel,
        bio: textToLexical(fixture.bio),
        researchInterests: fixture.researchInterests,
        socials: fixture.socials,
        email: fixture.email,
        orcid: fixture.orcid,
        openalex_id: fixture.openalex_id,
        dblp_pid: fixture.dblp_pid,
        role: fixture.role,
        displayInWebsite: fixture.displayInWebsite,
        source: fixture.source,
        alumniYear: fixture.alumniYear,
        currentPosition: fixture.currentPosition,
      },
    })
    teamIds.set(fixture.key, result.id)
  }

  return teamIds
}

function buildAuthors(authorKeys: string[], teamIds: Map<string, string>) {
  return authorKeys.map((key, index) => {
    const teamMember = teamIds.get(key)

    if (!teamMember) {
      throw new Error(`Missing Team id for publication author key: ${key}`)
    }

    return {
      teamMember,
      authorPosition: index + 1,
      isCoFirst: false,
      isCorresponding: index === 0,
    }
  })
}

async function seedPublications(
  payload: Payload,
  teamIds: Map<string, string>,
  venueIds: Map<string, string>,
) {
  const fixtures: PublicationFixture[] = [
    {
      title: seedName('Household Repair Practices in Low-Resource Urban Neighborhoods'),
      abstract:
        'A mixed-methods study of repair labor, informal technical expertise, and household resilience in dense urban communities.',
      keywords: ['repair', 'urban computing', 'resilience'],
      authorKeys: ['amina-rahman', 'john-smith', 'farhan-ahmed'],
      year: 2018,
      status: 'published',
      type: 'conference',
      publicationDate: '2018-04-23T00:00:00.000Z',
      venueKey: 'chi',
      location: 'Montreal, QC, Canada',
      doi: '10.1145/3173574.3174010',
      externalUrl: 'https://doi.org/10.1145/3173574.3174010',
      isOpenAccess: true,
      license: 'cc-by',
      openalex_id: 'W4310001001',
      citationCount: 29,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'crossref',
      provenanceImportedAt: '2026-07-05T09:05:00.000Z',
      provenanceSourceNote: 'Imported from ORCID -> Crossref enrichment.',
    },
    {
      title: seedName('Designing Voice Interfaces for Community Health Workers'),
      abstract:
        'Explores multilingual voice interfaces that support community health documentation in bandwidth-constrained settings.',
      keywords: ['voice UI', 'community health', 'multilingual design'],
      authorKeys: ['nabila-sultana', 'emily-chen', 'samira-islam'],
      year: 2019,
      status: 'published',
      type: 'journal',
      publicationDate: '2019-09-01T00:00:00.000Z',
      venueKey: 'ijhcs',
      volume: '129',
      pageStart: '54',
      pageEnd: '68',
      doi: '10.1016/j.ijhcs.2019.05.004',
      externalUrl: 'https://doi.org/10.1016/j.ijhcs.2019.05.004',
      isOpenAccess: false,
      license: 'all-rights-reserved',
      openalex_id: 'W4310001002',
      citationCount: 41,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'openalex',
      provenanceImportedAt: '2026-07-05T09:05:30.000Z',
      provenanceSourceNote: 'Imported from Crossref with OpenAlex metadata sync.',
    },
    {
      title: seedName('Collaborative Data Notebooks for Distributed Field Research'),
      abstract:
        'Introduces notebook workflows that help field teams coordinate annotations, evidence trails, and synthesis across sites.',
      keywords: ['notebooks', 'field research', 'collaboration'],
      authorKeys: ['farhan-ahmed', 'rafiul-karim', 'miguel-alvarez', 'chen-li'],
      year: 2020,
      status: 'published',
      type: 'conference',
      publicationDate: '2020-10-17T00:00:00.000Z',
      venueKey: 'cscw',
      location: 'Virtual Event',
      doi: '10.1145/3406865.3418291',
      externalUrl: 'https://doi.org/10.1145/3406865.3418291',
      isOpenAccess: true,
      license: 'cc-by',
      openalex_id: 'W4310001003',
      citationCount: 23,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'crossref',
      provenanceImportedAt: '2026-07-05T09:06:00.000Z',
      provenanceSourceNote: 'Imported from DOI quick-add during dashboard validation.',
    },
    {
      title: seedName('Mapping Trust in Rural Telemedicine Platforms'),
      abstract:
        'Charts the relationship between interpersonal trust, infrastructure reliability, and platform uptake in rural telemedicine.',
      keywords: ['telemedicine', 'trust', 'rural health'],
      authorKeys: ['samira-islam', 'fatima-noor', 'amina-rahman'],
      year: 2021,
      status: 'published',
      type: 'journal',
      publicationDate: '2021-03-15T00:00:00.000Z',
      venueKey: 'pacmhci',
      volume: '5',
      issue: 'CSCW1',
      pageStart: '1',
      pageEnd: '24',
      doi: '10.1145/3449245',
      externalUrl: 'https://doi.org/10.1145/3449245',
      isOpenAccess: true,
      license: 'cc-by',
      openalex_id: 'W4310001004',
      citationCount: 17,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'openalex',
      provenanceImportedAt: '2026-07-05T09:06:30.000Z',
      provenanceSourceNote: 'Imported from ORCID works list and enriched through OpenAlex.',
    },
    {
      title: seedName('Participatory Sensing for Heat Stress in Informal Settlements'),
      abstract:
        'Reports a participatory sensing deployment that connected neighborhood observations with heat-risk response planning.',
      keywords: ['participatory sensing', 'climate', 'informal settlements'],
      authorKeys: ['rafiul-karim', 'arjun-patel', 'amina-rahman'],
      year: 2021,
      status: 'published',
      type: 'workshop',
      publicationDate: '2021-05-07T00:00:00.000Z',
      venueKey: 'chi',
      location: 'Yokohama, Japan',
      doi: '10.1145/3411763.3451620',
      externalUrl: 'https://doi.org/10.1145/3411763.3451620',
      isOpenAccess: true,
      license: 'cc-by-nc',
      openalex_id: 'W4310001005',
      citationCount: 12,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'crossref',
      provenanceImportedAt: '2026-07-05T09:07:00.000Z',
      provenanceSourceNote: 'Imported from citation paste after DOI extraction.',
    },
    {
      title: seedName('Reframing AI Literacy for First-Generation University Students'),
      abstract:
        'Argues for an AI literacy curriculum centered on labor, accountability, and institutional power rather than tool fluency alone.',
      keywords: ['AI literacy', 'higher education', 'equity'],
      authorKeys: ['nabila-sultana', 'sofia-martinez', 'tasnim-chowdhury'],
      year: 2022,
      status: 'published',
      type: 'journal',
      publicationDate: '2022-08-18T00:00:00.000Z',
      venueKey: 'ijhcs',
      volume: '167',
      pageStart: '102872',
      pageEnd: '102872',
      doi: '10.1016/j.ijhcs.2022.102872',
      externalUrl: 'https://doi.org/10.1016/j.ijhcs.2022.102872',
      isOpenAccess: false,
      license: 'all-rights-reserved',
      openalex_id: 'W4310001006',
      citationCount: 19,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'openalex',
      provenanceImportedAt: '2026-07-05T09:07:30.000Z',
      provenanceSourceNote: 'Imported from BibTeX DOI entry and then enriched.',
    },
    {
      title: seedName('A BibTeX Survey of Peer Feedback in HCI Capstones'),
      abstract:
        'Synthesizes peer-feedback patterns across capstone studios and describes coordination burdens in instructor review.',
      keywords: ['peer feedback', 'capstones', 'studio pedagogy'],
      authorKeys: ['nabila-sultana', 'tasnim-chowdhury'],
      year: 2022,
      status: 'published',
      type: 'extended-abstract',
      publicationDate: '2022-11-02T00:00:00.000Z',
      venueLabel: 'HCI Education Workshop Proceedings',
      citationText:
        'Sultana, N., and Chowdhury, T. A BibTeX Survey of Peer Feedback in HCI Capstones. HCI Education Workshop Proceedings, 2022.',
      bibtex:
        '@inproceedings{seed-peer-feedback-2022,title={A BibTeX Survey of Peer Feedback in HCI Capstones},author={Sultana, Nabila and Chowdhury, Tasnim},year={2022}}',
      provenanceSource: 'bibtex',
      provenanceImportedAt: '2026-07-05T09:08:00.000Z',
      provenanceSourceNote: 'Seeded as a BibTeX-only record without DOI.',
    },
    {
      title: seedName('Understanding Repair Ecologies in Community Networks'),
      abstract:
        'Documents maintenance practices, hidden expertise, and social dependencies in volunteer-run community networks.',
      keywords: ['community networks', 'maintenance', 'infrastructure'],
      authorKeys: ['amina-rahman', 'jon-smith', 'daniel-wu'],
      year: 2023,
      status: 'published',
      type: 'conference',
      publicationDate: '2023-04-25T00:00:00.000Z',
      venueKey: 'chi',
      location: 'Hamburg, Germany',
      doi: '10.1145/3544548.3581124',
      externalUrl: 'https://doi.org/10.1145/3544548.3581124',
      isOpenAccess: true,
      license: 'cc-by',
      openalex_id: 'W4310001007',
      citationCount: 8,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'crossref',
      provenanceImportedAt: '2026-07-05T09:08:30.000Z',
      provenanceSourceNote: 'Imported from DOI quick-add during seed generation.',
    },
    {
      title: seedName('Designing Crisis-Ready Chatbots for Campus Services'),
      abstract:
        'Examines escalation patterns, trust signals, and fallback pathways in service chatbots used during emergencies.',
      keywords: ['chatbots', 'campus services', 'crisis response'],
      authorKeys: ['samira-islam', 'priya-natarajan', 'amina-rahman'],
      year: 2023,
      status: 'published',
      type: 'conference',
      publicationDate: '2023-10-15T00:00:00.000Z',
      venueLabel: 'Proceedings of the South Asia Civic Tech Forum',
      location: 'Colombo, Sri Lanka',
      citationText:
        'Islam, S., Natarajan, P., and Rahman, A. Designing Crisis-Ready Chatbots for Campus Services. Proceedings of the South Asia Civic Tech Forum, 2023.',
      bibtex:
        '@inproceedings{seed-chatbots-2023,title={Designing Crisis-Ready Chatbots for Campus Services},author={Islam, Samira and Natarajan, Priya and Rahman, Amina},year={2023}}',
      provenanceSource: 'bibtex',
      provenanceImportedAt: '2026-07-05T09:09:00.000Z',
      provenanceSourceNote:
        'Seeded as a BibTeX-only record to exercise no-DOI and unmatched-venue states.',
    },
    {
      title: seedName('Human-AI Coauthoring in Research Lab Operations'),
      abstract:
        'Studies how researchers delegate literature triage, summarization, and administrative coordination to AI systems.',
      keywords: ['human-AI collaboration', 'research operations', 'automation'],
      authorKeys: ['farhan-ahmed', 'john-smith', 'jon-smith', 'rafiul-karim'],
      year: 2024,
      status: 'published',
      type: 'journal',
      publicationDate: '2024-06-10T00:00:00.000Z',
      venueKey: 'pacmhci',
      volume: '8',
      issue: 'GROUP',
      pageStart: '1',
      pageEnd: '29',
      doi: '10.1145/3654778',
      externalUrl: 'https://doi.org/10.1145/3654778',
      isOpenAccess: true,
      license: 'cc-by',
      featured: true,
      openalex_id: 'W4310001008',
      citationCount: 11,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'openalex',
      provenanceImportedAt: '2026-07-05T09:09:30.000Z',
      provenanceSourceNote:
        'Imported from ORCID + OpenAlex, left with a deliberate fuzzy author duplicate.',
    },
    {
      title: seedName('A Study Protocol for Multilingual Mental Health Check-Ins'),
      abstract:
        'Protocol paper for a multilingual SMS-based mental health check-in study across university support programs.',
      keywords: ['study protocol', 'mental health', 'SMS'],
      authorKeys: ['samira-islam', 'fatima-noor', 'nabila-sultana'],
      year: 2024,
      status: 'published',
      type: 'study-protocol',
      publicationDate: '2024-09-12T00:00:00.000Z',
      venueLabel: 'South Asia Digital Health Methods Series',
      citationText:
        'Islam, S., Noor, F., and Sultana, N. A Study Protocol for Multilingual Mental Health Check-Ins. South Asia Digital Health Methods Series, 2024.',
      bibtex:
        '@article{seed-mental-health-2024,title={A Study Protocol for Multilingual Mental Health Check-Ins},author={Islam, Samira and Noor, Fatima and Sultana, Nabila},year={2024}}',
      provenanceSource: 'bibtex',
      provenanceImportedAt: '2026-07-05T09:10:00.000Z',
      provenanceSourceNote: 'Seeded as a BibTeX-only record to populate protocol-type UI states.',
    },
    {
      title: seedName('Preprint: Offline-First Annotation for Public Health Teams'),
      abstract:
        'Presents an offline-first annotation stack for distributed public-health teams working across unstable connectivity environments.',
      keywords: ['offline-first', 'annotation', 'public health'],
      authorKeys: ['rafiul-karim', 'emily-chen', 'amina-rahman'],
      year: 2025,
      status: 'preprint',
      type: 'preprint',
      publicationDate: '2025-02-14T00:00:00.000Z',
      externalUrl: 'https://arxiv.org/abs/2502.01422',
      isOpenAccess: true,
      license: 'cc-by',
      citationText:
        'Karim, R., Chen, E., and Rahman, A. Preprint: Offline-First Annotation for Public Health Teams. arXiv, 2025.',
      provenanceSource: 'manual',
      provenanceImportedAt: '2026-07-05T09:10:30.000Z',
      provenanceSourceNote: 'Manual seed fixture representing a non-DOI preprint.',
    },
    {
      title: seedName('Hybrid Mentorship Models for Undergraduate RAs'),
      abstract:
        'Analyzes mentorship structures that combine near-peer support, asynchronous feedback, and shared research operations tooling.',
      keywords: ['mentorship', 'undergraduate research', 'lab operations'],
      authorKeys: ['tasnim-chowdhury', 'farhan-ahmed', 'sofia-martinez'],
      year: 2025,
      status: 'accepted-in-press',
      type: 'book-chapter',
      acceptanceDate: '2025-11-03T00:00:00.000Z',
      editor: 'Khan, Nadia and Woods, David',
      publisher: 'Springer',
      series: 'Studies in Collaborative Learning',
      citationText:
        'Chowdhury, T., Ahmed, F., and Martinez, S. Hybrid Mentorship Models for Undergraduate RAs. In Khan, N. and Woods, D. (Eds.), Studies in Collaborative Learning, 2025.',
      bibtex:
        '@incollection{seed-mentorship-2025,title={Hybrid Mentorship Models for Undergraduate RAs},author={Chowdhury, Tasnim and Ahmed, Farhan and Martinez, Sofia},year={2025}}',
      provenanceSource: 'bibtex',
      provenanceImportedAt: '2026-07-05T09:11:00.000Z',
      provenanceSourceNote: 'Seeded as a BibTeX-only accepted-in-press chapter.',
    },
    {
      title: seedName('Community Data Stewardship in Flood Response Workflows'),
      abstract:
        'Describes stewardship practices for volunteer-collected flood response data and the governance challenges they expose.',
      keywords: ['data stewardship', 'flood response', 'governance'],
      authorKeys: ['amina-rahman', 'sara-lopez', 'omar-hassan'],
      year: 2026,
      status: 'submitted',
      type: 'journal',
      publicationDate: '2026-03-09T00:00:00.000Z',
      venueLabel: 'Journal of Civic Data Practice',
      citationText:
        'Rahman, A., Lopez, S., and Hassan, O. Community Data Stewardship in Flood Response Workflows. Submitted manuscript, 2026.',
      provenanceSource: 'manual',
      provenanceImportedAt: '2026-07-05T09:11:30.000Z',
      provenanceSourceNote: 'Manual seed fixture representing a submission awaiting DOI.',
    },
    {
      title: seedName('Anticipating Data Stewardship Needs in Community AI Labs'),
      abstract:
        'Forecasts data stewardship, authorship, and compliance needs as community AI labs scale their ingestion and review workflows.',
      keywords: ['community AI', 'data stewardship', 'compliance'],
      authorKeys: ['amina-rahman', 'farhan-ahmed', 'daniel-wu'],
      year: 2026,
      status: 'accepted-in-press',
      type: 'journal',
      acceptanceDate: '2026-06-01T00:00:00.000Z',
      venueKey: 'ijhcs',
      doi: '10.9999/ijhcs.seed.2026.0042',
      externalUrl: 'https://doi.org/10.9999/ijhcs.seed.2026.0042',
      isOpenAccess: false,
      license: 'all-rights-reserved',
      openalex_id: 'W4310001009',
      citationCount: 0,
      citationCountUpdatedAt: '2026-06-15T00:00:00.000Z',
      provenanceSource: 'crossref',
      provenanceImportedAt: '2026-07-05T09:12:00.000Z',
      provenanceSourceNote:
        'Imported fixture whose DOI is intentionally represented in review items as failed.',
    },
  ]

  for (const fixture of fixtures) {
    await upsertSeedDoc({
      payload,
      collection: 'publications',
      field: 'title',
      value: fixture.title,
      data: {
        title: fixture.title,
        abstract: fixture.abstract,
        keywords: fixture.keywords,
        authors: buildAuthors(fixture.authorKeys, teamIds),
        year: fixture.year,
        status: fixture.status,
        type: fixture.type,
        publicationDate: fixture.publicationDate,
        acceptanceDate: fixture.acceptanceDate,
        venue: fixture.venueKey ? venueIds.get(fixture.venueKey) : undefined,
        venueLabel: fixture.venueLabel,
        location: fixture.location,
        volume: fixture.volume,
        issue: fixture.issue,
        pageStart: fixture.pageStart,
        pageEnd: fixture.pageEnd,
        publisher: fixture.publisher,
        series: fixture.series,
        editor: fixture.editor,
        citationText: fixture.citationText,
        doi: fixture.doi,
        externalUrl: fixture.externalUrl,
        isOpenAccess: fixture.isOpenAccess,
        license: fixture.license,
        featured: fixture.featured,
        openalex_id: fixture.openalex_id,
        citationCount: fixture.citationCount,
        citationCountUpdatedAt: fixture.citationCountUpdatedAt,
        bibtex: fixture.bibtex,
        provenance: {
          source: fixture.provenanceSource,
          importedAt: fixture.provenanceImportedAt,
          sourceNote: fixture.provenanceSourceNote,
        },
      },
    })
  }
}

async function seedImportRuns(payload: Payload) {
  const completedRun = await upsertSeedDoc({
    payload,
    collection: 'import-runs',
    field: 'label',
    value: seedName('ORCID import - 0000-0002-4871-9814'),
    data: {
      label: seedName('ORCID import - 0000-0002-4871-9814'),
      source: 'orcid',
      status: 'completed',
      params: { orcid: '0000-0002-4871-9814' },
      candidates: [
        {
          key: 'doi:10.1145/3173574.3174010',
          title: seedName('Household Repair Practices in Low-Resource Urban Neighborhoods'),
          year: 2018,
          doi: '10.1145/3173574.3174010',
          selected: true,
          status: 'created',
        },
        {
          key: 'doi:10.1016/j.ijhcs.2019.05.004',
          title: seedName('Designing Voice Interfaces for Community Health Workers'),
          year: 2019,
          doi: '10.1016/j.ijhcs.2019.05.004',
          selected: true,
          status: 'created',
        },
        {
          key: 'doi:10.1145/3654778',
          title: seedName('Human-AI Coauthoring in Research Lab Operations'),
          year: 2024,
          doi: '10.1145/3654778',
          selected: true,
          status: 'created',
        },
        {
          key: 'orcid:3',
          title: seedName('Community Data Stewardship in Flood Response Workflows'),
          year: 2026,
          note: 'no DOI found - career-wide ORCID result, needs manual review',
          selected: false,
          status: 'flagged',
        },
        {
          key: 'doi:10.1016/j.ijhcs.2022.102872',
          title: seedName('Reframing AI Literacy for First-Generation University Students'),
          year: 2022,
          doi: '10.1016/j.ijhcs.2022.102872',
          selected: true,
          status: 'skipped-existing',
        },
      ],
      progress: {
        total: 5,
        processed: 5,
        created: 3,
        skippedExisting: 1,
        failed: 1,
      },
      reportSummary: {
        counts: {
          publications: {
            created: 3,
            updated: 0,
            'skipped-dry-run': 0,
            'skipped-existing': 1,
          },
          team: {
            created: 4,
            updated: 0,
            'skipped-dry-run': 0,
            'skipped-existing': 0,
          },
        },
        unmatched: [
          {
            collection: 'publications',
            field: 'doi',
            sourceContext: seedSourceContext('ORCID work without DOI for community flood response'),
            value: '(no DOI)',
          },
          {
            collection: 'venues',
            field: 'name',
            sourceContext: seedSourceContext(
              'Community Data Stewardship in Flood Response Workflows',
            ),
            value: 'Journal of Civic Data Practice',
          },
          {
            collection: 'organizations',
            field: 'name',
            sourceContext: seedSourceContext('Human-AI Coauthoring in Research Lab Operations'),
            value: 'Center for Responsible AI Practice',
          },
          {
            collection: 'publications',
            field: 'type',
            sourceContext: seedSourceContext('A BibTeX Survey of Peer Feedback in HCI Capstones'),
            value: 'poster',
          },
          {
            collection: 'publications',
            field: 'doi',
            sourceContext: seedSourceContext(
              'Anticipating Data Stewardship Needs in Community AI Labs',
            ),
            value: '10.9999/ijhcs.seed.2026.0042',
          },
        ],
        suggestions: [],
      },
      startedAt: '2026-07-04T08:10:00.000Z',
      finishedAt: '2026-07-04T08:17:00.000Z',
    },
  })

  const stagedBibtex = `@inproceedings{seed-chatbots-2023,
  title={${seedName('Designing Crisis-Ready Chatbots for Campus Services')}},
  author={Islam, Samira and Natarajan, Priya and Rahman, Amina},
  year={2023}
}

@article{seed-mental-health-2024,
  title={${seedName('A Study Protocol for Multilingual Mental Health Check-Ins')}},
  author={Islam, Samira and Noor, Fatima and Sultana, Nabila},
  year={2024}
}`

  const stagedRun = await upsertSeedDoc({
    payload,
    collection: 'import-runs',
    field: 'label',
    value: seedName('BibTeX import - onboarding sample bibliography'),
    data: {
      label: seedName('BibTeX import - onboarding sample bibliography'),
      source: 'bibtex',
      status: 'staged',
      params: { sourceFile: 'onboarding-sample.bib' },
      rawInput: stagedBibtex,
      candidates: [
        {
          key: 'bibtex:seed-chatbots-2023',
          title: seedName('Designing Crisis-Ready Chatbots for Campus Services'),
          year: 2023,
          note: 'no DOI found - bibtex entry has no doi field',
          selected: false,
          status: 'pending',
        },
        {
          key: 'bibtex:seed-mental-health-2024',
          title: seedName('A Study Protocol for Multilingual Mental Health Check-Ins'),
          year: 2024,
          note: 'no DOI found - bibtex entry has no doi field',
          selected: false,
          status: 'pending',
        },
        {
          key: 'bibtex:seed-mentorship-2025',
          title: seedName('Hybrid Mentorship Models for Undergraduate RAs'),
          year: 2025,
          note: 'no DOI found - bibtex entry has no doi field',
          selected: false,
          status: 'pending',
        },
        {
          key: 'bibtex:seed-peer-feedback-2022',
          title: seedName('A BibTeX Survey of Peer Feedback in HCI Capstones'),
          year: 2022,
          note: 'no DOI found - bibtex entry has no doi field',
          selected: false,
          status: 'pending',
        },
        {
          key: 'bibtex:seed-civic-book-2026',
          title: seedName('Community Data Stewardship in Flood Response Workflows'),
          year: 2026,
          note: 'no DOI found - bibtex entry has no doi field',
          selected: true,
          status: 'pending',
        },
        {
          key: 'bibtex:seed-ai-stewardship-2026',
          title: seedName('Anticipating Data Stewardship Needs in Community AI Labs'),
          year: 2026,
          doi: '10.9999/ijhcs.seed.2026.0042',
          selected: true,
          status: 'pending',
        },
      ],
      progress: {
        total: 0,
        processed: 0,
        created: 0,
        skippedExisting: 0,
        failed: 0,
      },
      startedAt: '2026-07-05T07:40:00.000Z',
    },
  })

  const runningRun = await upsertSeedDoc({
    payload,
    collection: 'import-runs',
    field: 'label',
    value: seedName('Citation paste import - faculty annual report'),
    data: {
      label: seedName('Citation paste import - faculty annual report'),
      source: 'citations',
      status: 'running',
      params: { pastedBy: 'dashboard-wizard', lineCount: 12 },
      rawInput: `${SEED_PREFIX}Rahman, A. et al. Human-AI Coauthoring in Research Lab Operations...\n\n${SEED_PREFIX}Islam, S. et al. Designing Crisis-Ready Chatbots for Campus Services...`,
      candidates: [
        {
          key: 'doi:10.1145/3654778',
          title: seedName('Human-AI Coauthoring in Research Lab Operations'),
          year: 2024,
          doi: '10.1145/3654778',
          selected: true,
          status: 'skipped-existing',
        },
        {
          key: 'citations:1',
          title: seedName('Designing Crisis-Ready Chatbots for Campus Services'),
          year: 2023,
          selected: true,
          status: 'flagged',
          note: 'no DOI found - reverse lookup unresolved',
        },
        {
          key: 'doi:10.1145/3544548.3581124',
          title: seedName('Understanding Repair Ecologies in Community Networks'),
          year: 2023,
          doi: '10.1145/3544548.3581124',
          selected: true,
          status: 'created',
        },
        {
          key: 'doi:10.1145/3406865.3418291',
          title: seedName('Collaborative Data Notebooks for Distributed Field Research'),
          year: 2020,
          doi: '10.1145/3406865.3418291',
          selected: true,
          status: 'created',
        },
        {
          key: 'doi:10.1016/j.ijhcs.2022.102872',
          title: seedName('Reframing AI Literacy for First-Generation University Students'),
          year: 2022,
          doi: '10.1016/j.ijhcs.2022.102872',
          selected: true,
          status: 'skipped-existing',
        },
        {
          key: 'citations:5',
          title: seedName('Community Data Stewardship in Flood Response Workflows'),
          year: 2026,
          selected: true,
          status: 'failed',
          note: 'crossref reverse lookup returned no confident hit',
        },
        {
          key: 'doi:10.1145/3411763.3451620',
          title: seedName('Participatory Sensing for Heat Stress in Informal Settlements'),
          year: 2021,
          doi: '10.1145/3411763.3451620',
          selected: true,
          status: 'created',
        },
        {
          key: 'citations:7',
          title: seedName('A Study Protocol for Multilingual Mental Health Check-Ins'),
          year: 2024,
          selected: false,
          status: 'pending',
          note: 'manually deselected for now',
        },
        {
          key: 'citations:8',
          title: seedName('Hybrid Mentorship Models for Undergraduate RAs'),
          year: 2025,
          selected: true,
          status: 'pending',
        },
        {
          key: 'citations:9',
          title: seedName('Community Data Stewardship in Flood Response Workflows'),
          year: 2026,
          selected: true,
          status: 'pending',
        },
        {
          key: 'citations:10',
          title: seedName('Anticipating Data Stewardship Needs in Community AI Labs'),
          year: 2026,
          selected: true,
          status: 'pending',
        },
        {
          key: 'citations:11',
          title: seedName('Preprint: Offline-First Annotation for Public Health Teams'),
          year: 2025,
          selected: true,
          status: 'pending',
        },
      ],
      progress: {
        total: 12,
        processed: 8,
        created: 3,
        skippedExisting: 2,
        failed: 1,
      },
      startedAt: '2026-07-05T08:15:00.000Z',
    },
  })

  return {
    completed: completedRun.id,
    staged: stagedRun.id,
    running: runningRun.id,
  }
}

async function seedReviewItems(
  payload: Payload,
  runIds: Record<'completed' | 'staged' | 'running', string>,
  teamIds: Map<string, string>,
) {
  const jonId = teamIds.get('jon-smith')
  const johnId = teamIds.get('john-smith')

  if (!jonId || !johnId) {
    throw new Error('Expected seeded Team ids for Jon Smith and John Smith')
  }

  const fixtures: ReviewItemFixture[] = [
    {
      kind: 'person-merge-suggestion',
      status: 'open',
      runKey: 'completed',
      value: `Jon Smith (new id: ${jonId})`,
      sourceContext: seedSourceContext(
        'Imported co-author graph for Human-AI Coauthoring in Research Lab Operations',
      ),
      data: {
        suggestedMatch: `John Smith (id: ${johnId})`,
      },
    },
    {
      kind: 'unmatched-venue',
      status: 'open',
      runKey: 'completed',
      value: 'Journal of Civic Data Practice',
      sourceContext: seedSourceContext('Community Data Stewardship in Flood Response Workflows'),
      data: null,
    },
    {
      kind: 'unmatched-org',
      status: 'open',
      runKey: 'completed',
      value: 'Center for Responsible AI Practice',
      sourceContext: seedSourceContext('Human-AI Coauthoring in Research Lab Operations'),
      data: null,
    },
    {
      kind: 'no-doi-work',
      status: 'open',
      runKey: 'completed',
      value: '(no DOI)',
      sourceContext: seedSourceContext('Tasnim Chowdhury graduation bibliography export'),
      data: null,
    },
    {
      kind: 'unparsed-citation',
      status: 'dismissed',
      runKey: 'running',
      value: 'ambiguous - two citations collapsed into one paragraph',
      sourceContext: seedSourceContext('Citation wall lines 14-19 from faculty annual report'),
      data: null,
      resolution: {
        note: 'Dismissed after confirming the source paragraph needs manual splitting before import.',
      },
      resolvedAt: '2026-07-05T08:32:00.000Z',
    },
    {
      kind: 'unmapped-type',
      status: 'open',
      runKey: 'completed',
      value: 'poster',
      sourceContext: seedSourceContext('A BibTeX Survey of Peer Feedback in HCI Capstones'),
      data: null,
    },
    {
      kind: 'failed-doi',
      status: 'accepted',
      runKey: 'completed',
      value: '10.9999/ijhcs.seed.2026.0042',
      sourceContext: seedSourceContext('Anticipating Data Stewardship Needs in Community AI Labs'),
      data: null,
      resolution: {
        note: 'Accepted as a placeholder to show resolved DOI failures in the queue.',
      },
      resolvedAt: '2026-07-05T08:40:00.000Z',
    },
    {
      kind: 'unmatched-venue',
      status: 'open',
      runKey: 'running',
      value: 'Proceedings of the South Asia Civic Tech Forum',
      sourceContext: seedSourceContext('Designing Crisis-Ready Chatbots for Campus Services'),
      data: null,
    },
  ]

  for (const fixture of fixtures) {
    await upsertSeedDoc({
      payload,
      collection: 'review-items',
      field: 'sourceContext',
      value: fixture.sourceContext,
      data: {
        kind: fixture.kind,
        status: fixture.status,
        run: fixture.runKey ? runIds[fixture.runKey] : undefined,
        value: fixture.value,
        sourceContext: fixture.sourceContext,
        data: fixture.data,
        resolution: fixture.resolution,
        resolvedAt: fixture.resolvedAt,
      },
    })
  }
}

function printSummary() {
  const render = (label: string, counts: CountMap) => {
    const entries = Object.entries(counts)
    if (entries.length === 0) {
      console.log(`${label}: none`)
      return
    }

    console.log(label)
    for (const [key, value] of entries) {
      console.log(`- ${key}: ${value}`)
    }
  }

  render('Created', summary.created)
  render('Updated', summary.updated)
  render('Deleted', summary.deleted)
}

async function main() {
  const payload = await getPayload({ config })

  if (SHOULD_WIPE) {
    await wipe(payload)
    printSummary()
    return
  }

  await seedLabInfo(payload)
  const organizationIds = await seedOrganizations(payload)
  const venueIds = await seedVenues(payload, organizationIds)
  const teamIds = await seedTeam(payload, organizationIds)
  await seedPublications(payload, teamIds, venueIds)
  const runIds = await seedImportRuns(payload)
  await seedReviewItems(payload, runIds, teamIds)

  printSummary()
}

await main().catch((error) => {
  console.error(error)
  process.exit(1)
})
