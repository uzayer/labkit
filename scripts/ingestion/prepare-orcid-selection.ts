/** Stage a reviewable ORCID selection template without touching Payload or MongoDB.
 * Run: bun run payload -- run scripts/ingestion/prepare-orcid-selection.ts <orcid-id> [since=YYYY]
 */
import { stageOrcidCandidates } from '@/lib/ingestion/staging'
import { writeOrcidSelectionTemplate } from './orcid-selection'

const args = process.argv.slice(2)
const orcidId = args.find((arg) => !arg.startsWith('since='))
const sinceArg = args.find((arg) => arg.startsWith('since='))
const since = sinceArg ? Number(sinceArg.slice('since='.length)) : undefined
if (!orcidId || (sinceArg && !(Number.isInteger(since) && since! >= 1900 && since! <= 2100))) {
  throw new Error('Usage: prepare-orcid-selection.ts <orcid-id> [since=YYYY]')
}

const staged = await stageOrcidCandidates(orcidId)
const inRange = staged.filter((candidate) =>
  since === undefined ? true : candidate.year === undefined || candidate.year >= since,
)
const path = await writeOrcidSelectionTemplate(orcidId, since, inRange)
console.log(`${staged.length} works staged; ${inRange.length} in range; all excluded for review.`)
console.log(path)
