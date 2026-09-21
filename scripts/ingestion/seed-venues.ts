/**
 * Seed DIAL's recurring Venues before an import, so their papers link to one
 * curated record (with a shortName) instead of a per-year free-text label.
 *
 * Run: pnpm payload run scripts/ingestion/seed-venues.ts [dry-run]
 *
 * Reference data the Operator seeds before running a Front Door. Ingestion's
 * resolveVenue matches an incoming venue string against `name` and
 * `alternateNames` exactly after normalizeVenueName (years, numeric ordinals,
 * "Proceedings of the", punctuation and case removed) — never fuzzily. So each
 * alternateName below is a spelling that actually came back from Crossref for
 * DIAL's ORCID record and does not already normalise to the venue's `name`.
 *
 * Derived from the 2026-09-22 dry run of the PI's ORCID with since=2017.
 * CHI main-track papers and CHI Extended Abstracts are separate venues on
 * purpose: a late-breaking-work abstract is not a CHI paper, and the public
 * site must not present it as one.
 *
 * Idempotent: upserts by normalised name (a record whose name or any
 * alternateName normalises to the seed's name is updated, alternateNames
 * merged); otherwise creates.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { normalizeVenueName } from '@/lib/ingestion/normalize'

type VenueType = 'conference' | 'journal' | 'workshop' | 'book-series' | 'other'

interface SeedVenue {
  name: string
  shortName: string
  type: VenueType
  alternateNames?: string[]
}

const VENUES: SeedVenue[] = [
  {
    name: 'ACM CHI Conference on Human Factors in Computing Systems',
    shortName: 'CHI',
    type: 'conference',
    alternateNames: [
      'CHI Conference on Human Factors in Computing Systems',
      'SIGCHI Conference on Human Factors in Computing Systems',
    ],
  },
  {
    name: 'Extended Abstracts of the CHI Conference on Human Factors in Computing Systems',
    shortName: 'CHI EA',
    type: 'conference',
    alternateNames: ['CHI Conference Extended Abstracts on Human Factors in Computing Systems'],
  },
  {
    name: 'ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies',
    shortName: 'COMPASS',
    type: 'conference',
  },
  {
    name: 'ACM Journal on Computing and Sustainable Societies',
    shortName: 'ACM JCSS',
    type: 'journal',
  },
  {
    name: 'International Conference on Information and Communication Technologies and Development',
    shortName: 'ICTD',
    type: 'conference',
    // Word ordinals are deliberately outside normalizeVenueName, so each
    // edition that Crossref spells out is listed.
    alternateNames: [
      'Ninth International Conference on Information and Communication Technologies and Development',
      'Tenth International Conference on Information and Communication Technologies and Development',
    ],
  },
  {
    name: 'Companion Publication of the Conference on Computer-Supported Cooperative Work and Social Computing',
    shortName: 'CSCW Companion',
    type: 'conference',
  },
  {
    name: 'Proceedings of the ACM on Human-Computer Interaction',
    shortName: 'PACM HCI',
    type: 'journal',
  },
  {
    name: 'ACM International Joint Conference on Pervasive and Ubiquitous Computing — Adjunct',
    shortName: 'UbiComp Adjunct',
    type: 'conference',
    alternateNames: [
      'Adjunct Proceedings of the ACM International Joint Conference on Pervasive and Ubiquitous Computing and Proceedings of the ACM International Symposium on Wearable Computers',
      'Companion of the on ACM International Joint Conference on Pervasive and Ubiquitous Computing',
    ],
  },
  { name: 'JMIR Formative Research', shortName: 'JMIR Form Res', type: 'journal' },
  { name: 'JMIR Research Protocols', shortName: 'JMIR Res Protoc', type: 'journal' },
]

const DRY_RUN = process.argv.includes('dry-run')

async function main() {
  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'venues',
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  for (const seed of VENUES) {
    const key = normalizeVenueName(seed.name)
    const matches = existing.docs.filter((doc) =>
      [doc.name, ...(doc.alternateNames ?? [])].some(
        (candidate) => normalizeVenueName(candidate) === key,
      ),
    )
    if (matches.length > 1) {
      console.warn(
        `SKIP ${seed.shortName}: ${matches.length} existing venues share its name — resolve by hand`,
      )
      continue
    }

    const match = matches[0]
    const alternateNames = [
      ...new Set([...(match?.alternateNames ?? []), ...(seed.alternateNames ?? [])]),
    ]
    const data = { shortName: seed.shortName, type: seed.type, alternateNames }

    if (match) {
      console.log(
        `${DRY_RUN ? 'would update' : 'update'}  ${seed.shortName.padEnd(16)} ${match.id}  ${match.name}`,
      )
      if (!DRY_RUN) {
        await payload.update({
          collection: 'venues',
          id: match.id,
          data,
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
      }
    } else if (DRY_RUN) {
      console.log(`would create ${seed.shortName.padEnd(16)} ${seed.name}`)
    } else {
      const created = await payload.create({
        collection: 'venues',
        data: { name: seed.name, ...data },
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
      existing.docs.push(created)
      console.log(`create  ${seed.shortName.padEnd(16)} ${created.id}  ${seed.name}`)
    }
  }

  process.exit(0)
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
