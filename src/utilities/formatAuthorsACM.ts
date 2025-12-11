import type { Team } from '@/payload-types'

interface AuthorEntry {
  teamMember?: Team | string | null
  customAuthor?: string | null
  isCoFirst?: boolean | null
}

interface FormatAuthorsACMResult {
  formatted: string
  hasCoFirstAuthors: boolean
}

/**
 * Formats publication authors in ACM style.
 *
 * Rules:
 * - "F. LastName" (first initial + period + space + last name)
 * - Multiple authors separated by ", "
 * - Last author preceded by "and" for 2+ authors
 * - Co-first authors marked with asterisk (*)
 * - For 10+ authors: show first 7, then "et al."
 */
export function formatAuthorsACM(
  authors: AuthorEntry[] | null | undefined,
): FormatAuthorsACMResult {
  if (!authors || authors.length === 0) {
    return { formatted: '', hasCoFirstAuthors: false }
  }

  let hasCoFirstAuthors = false

  const formattedNames = authors.map((author) => {
    if (author.isCoFirst) {
      hasCoFirstAuthors = true
    }

    let formatted = 'Unknown Author'

    // CASE 1: Team Member (Internal)
    if (author.teamMember && typeof author.teamMember === 'object') {
      const member = author.teamMember

      // Prefer granular fields if available
      if (member.firstName && member.lastName) {
        const firstInitial = member.firstName.charAt(0).toUpperCase()
        formatted = `${firstInitial}. ${member.lastName}`
      }
      // Fallback to parsing full name
      else if (member.name) {
        const nameParts = member.name.trim().split(/\s+/)
        if (nameParts.length === 1) {
          formatted = nameParts[0]
        } else {
          const firstInitial = nameParts[0].charAt(0).toUpperCase()
          const lastName = nameParts[nameParts.length - 1]
          formatted = `${firstInitial}. ${lastName}`
        }
      }
    }
    // CASE 2: Custom Author (External)
    else if (author.customAuthor) {
      const nameParts = author.customAuthor.trim().split(/\s+/)
      if (nameParts.length === 1) {
        formatted = nameParts[0]
      } else {
        const firstInitial = nameParts[0].charAt(0).toUpperCase()
        const lastName = nameParts[nameParts.length - 1]
        formatted = `${firstInitial}. ${lastName}`
      }
    }

    if (author.isCoFirst) {
      formatted += '*'
    }

    return { name: formatted, isCoFirst: author.isCoFirst }
  })

  const MAX_AUTHORS_BEFORE_ET_AL = 10
  const SHOW_AUTHORS_WITH_ET_AL = 7

  let result: string

  if (formattedNames.length > MAX_AUTHORS_BEFORE_ET_AL) {
    const shown = formattedNames.slice(0, SHOW_AUTHORS_WITH_ET_AL).map((a) => a.name)
    result = `${shown.join(', ')}, et al.`
  } else if (formattedNames.length === 1) {
    result = formattedNames[0].name
  } else if (formattedNames.length === 2) {
    result = `${formattedNames[0].name} and ${formattedNames[1].name}`
  } else {
    const allButLast = formattedNames.slice(0, -1).map((a) => a.name)
    const last = formattedNames[formattedNames.length - 1].name
    result = `${allButLast.join(', ')}, and ${last}`
  }

  return { formatted: result, hasCoFirstAuthors }
}
