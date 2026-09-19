/**
 * Record shapes for the prototype's data module.
 *
 * Each type is a trimmed copy of the matching LabKit Payload collection type
 * (`src/payload-types.ts` in the LabKit root), so porting a page means swapping
 * where records come from, not what they look like. Deliberate differences:
 *
 * - `id` is a stable slug, and relationships are id strings (Payload's
 *   unpopulated form). Resolve them with the lookups in `./index.ts`.
 * - Lexical rich-text fields (`bio`, `content`) are plain strings.
 * - Media fields are image URLs, not Media records.
 * - System fields (`createdAt`, `updatedAt`, `slugLock`, SEO, etc.) are omitted.
 * - Additions with no LabKit field yet: `Provenance.source: 'orcid'` and
 *   `Grant.amountLabel`.
 *
 * `News` and `LabInfo` have no LabKit collection yet; their shapes are
 * prototype-only.
 */

export type Provenance = {
  source?: 'manual' | 'crossref' | 'openalex' | 'bibtex' | 'scrape' | 'orcid' | null
  /** Where the record came from, e.g. a capture filename and heading. */
  sourceNote?: string | null
}

export type PersonRef = {
  name?: string | null
  orcid?: string | null
  /** Organization id, or free text when no Organization record exists. */
  affiliation?: string | null
}

export type ResearchTheme = {
  id: string
  title: string
  slug: string
  shortDescription?: string | null
  featured?: boolean | null
  provenance?: Provenance
}

export type Organization = {
  id: string
  name: string
  shortName?: string | null
  country?: string | null
  type?:
    | 'university'
    | 'research-institute'
    | 'funding-agency'
    | 'company'
    | 'government'
    | 'publisher'
    | 'other'
    | null
  url?: string | null
  ror_id?: string | null
  provenance?: Provenance
}

export type Venue = {
  id: string
  name: string
  shortName?: string | null
  type?: 'conference' | 'journal' | 'workshop' | 'book-series' | 'other' | null
  url?: string | null
}

export type TeamRole =
  | 'director'
  | 'faculty'
  | 'graduate-ra'
  | 'undergraduate-ra'
  | 'alumni'
  | 'interdisciplinary-collaborator'
  | 'external-collaborator'

export type Team = {
  id: string
  name: string
  slug: string
  title: string
  firstName: string
  middleName?: string | null
  lastName: string
  role: TeamRole
  affiliation?: string | null
  affiliationLabel?: string | null
  photo?: string | null
  bio?: string | null
  researchInterests?: string[] | null
  socials?: { platform: 'google-scholar' | 'linkedin' | 'website' | 'x' | 'github'; url: string }[] | null
  email?: string | null
  orcid?: string | null
  displayInWebsite?: boolean | null
  alumniYear?: number | null
  currentPosition?: string | null
  /**
   * Prototype-only: the section of the source People page the person is listed
   * under. LabKit has no equivalent field; `role` alone cannot distinguish the
   * page's "Researchers" (research staff) and "Emerging" groups.
   */
  /**
   * Prototype-only: other spellings of this person's name that the captures
   * use (e.g. on the People page or in a citation). Used for exact-name author
   * matching, since publications.ts leaves `teamMember` unset. Never fuzzy.
   */
  nameVariants?: string[] | null
  rosterSection?:
    | 'researchers'
    | 'graduate'
    | 'undergraduate'
    | 'emerging'
    | 'study-leave'
    | 'professional-leave'
    | null
  provenance?: Provenance
}

export type PublicationType =
  | 'conference'
  | 'journal'
  | 'workshop'
  | 'preprint'
  | 'extended-abstract'
  | 'study-protocol'
  | 'book-chapter'

export type Publication = {
  id: string
  title: string
  abstract?: string | null
  authors: {
    /** Team id when the author safely matches a Team record. */
    teamMember?: string | null
    customAuthor?: PersonRef
  }[]
  year: number
  status: 'published' | 'accepted-in-press' | 'submitted' | 'preprint'
  type?: PublicationType | null
  venue?: string | null
  /** Free-text venue, used when there is no Venue record. */
  venueLabel?: string | null
  citationText?: string | null
  doi?: string | null
  externalUrl?: string | null
  isOpenAccess?: boolean | null
  pdf?: { link?: string | null } | null
  featured?: boolean | null
  themes?: string[] | null
  awards?: string[] | null
  provenance?: Provenance
}

export type Project = {
  id: string
  title: string
  slug: string
  localName?: string | null
  abstract?: string | null
  heroImage?: string | null
  startDate?: string | null
  endDate?: string | null
  externalUrl?: string | null
  teamMembers?: string[] | null
  grants?: string[] | null
  themes?: string[] | null
  publications?: string[] | null
  awards?: string[] | null
  content?: string | null
  status?: 'ongoing' | 'completed' | null
  featured?: boolean | null
  provenance?: Provenance
}

export type Grant = {
  id: string
  title: string
  slug: string
  description?: string | null
  funder?: string | null
  funderLabel?: string | null
  amountValue?: number | null
  amountCurrency?: 'USD' | 'BDT' | 'EUR' | 'GBP' | null
  /** Amount as the source states it, when it can't be a number (e.g. "5 lac"). */
  amountLabel?: string | null
  startDate?: string | null
  endDate?: string | null
  investigators?: {
    teamMember?: string | null
    customInvestigator?: PersonRef
    role?: 'pi' | 'co-pi' | 'collaborator' | null
  }[] | null
  url?: string | null
  status?: 'active' | 'completed' | 'pending' | null
  featured?: boolean | null
  themes?: string[] | null
  provenance?: Provenance
}

export type Award = {
  id: string
  title: string
  year: number
  endYear?: number | null
  category?:
    | 'best-paper'
    | 'honorable-mention'
    | 'best-presentation'
    | 'best-demo'
    | 'best-poster'
    | 'impact'
    | 'research-grant'
    | 'scholarship'
    | 'recognition'
    | 'fellowship'
    | 'competition'
    | 'other'
    | null
  scope?: 'lab' | 'personal' | null
  recipients?: { teamMember?: string | null; customRecipient?: PersonRef }[] | null
  organization?: string | null
  organizationLabel?: string | null
  url?: string | null
  featured?: boolean | null
  provenance?: Provenance
}

/** Prototype-only: no LabKit collection yet. See dial-test/CLAUDE.md `/news`. */
export type News = {
  id: string
  type: 'academic' | 'event' | 'community'
  date: string
  title: string
  description: string
  photo?: string | null
  url?: string | null
  /**
   * Prototype-only: how much of `date` the source actually states. Many
   * captured entries give only a year or month; the feed must not print an
   * invented day.
   */
  datePrecision?: 'day' | 'month' | 'year' | null
  provenance?: Provenance
}

/** Mirrors the LabKit `LabInfo` global loosely; prototype-only fields allowed. */
export type LabInfo = {
  name: string
  shortName: string
  institution: string
  tagline?: string | null
  email?: string | null
  address?: string | null
  socials?: { platform: string; url: string }[] | null
  /** Prototype-only: year DIAL was established (LabKit has `foundingDate`). */
  foundedYear?: number | null
  /** Prototype-only: year the parent NSUHCI group began HCI research. */
  hciResearchSince?: number | null
  /** Prototype-only: the parent research group DIAL sits inside. */
  parentGroup?: string | null
  /** Prototype-only: current recruitment window (ISO dates), if one is announced. */
  recruitment?: { opens: string; closes: string } | null
  provenance?: Provenance
}
