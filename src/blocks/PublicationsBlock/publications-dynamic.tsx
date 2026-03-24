import React from 'react'
import configPromise from '@payload-config'
import type { Where } from 'payload'
import { getPayload } from 'payload'

import PublicationsDynamicClient, {
  FormattedPublication,
  PublicationsDynamicClientProps,
} from './publications-dynamic-client'
import type { Publication, PublicationsBlock } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'
import { formatAuthorsACM } from '@/utilities/formatAuthorsACM'

type PublicationsDynamicProps = PublicationsBlock & {
  publicContext: PublicContextProps
}

function buildWhereFromFilters(filters: PublicationsBlock['filters'] | null | undefined): Where {
  const where: Where = {
    AND: [],
  }

  if (!filters) return where

  const andClauses: Where['AND'] = []

  if (filters.projects?.length) {
    filters.projects.forEach((project) => {
      const id = typeof project === 'string' ? project : project.id
      andClauses.push({
        projects: {
          contains: id,
        },
      })
    })
  }

  if (filters.authors?.length) {
    filters.authors.forEach((author) => {
      const id = typeof author === 'string' ? author : author.id
      andClauses.push({
        'authors.teamMember': {
          equals: id,
        },
      })
    })
  }

  if (filters.themes?.length) {
    filters.themes.forEach((theme) => {
      const id = typeof theme === 'string' ? theme : theme.id
      andClauses.push({
        themes: {
          contains: id,
        },
      })
    })
  }

  if (filters.types?.length) {
    andClauses.push({
      type: {
        in: filters.types,
      },
    })
  }

  if (typeof filters.fromYear === 'number') {
    andClauses.push({
      year: {
        greater_than_equal: filters.fromYear,
      },
    })
  }

  if (!filters.toPresent && typeof filters.toYear === 'number') {
    andClauses.push({
      year: {
        less_than_equal: filters.toYear,
      },
    })
  }

  if (filters.featuredOnly) {
    andClauses.push({
      featured: {
        equals: true,
      },
    })
  }

  if (filters.statuses?.length) {
    andClauses.push({
      status: {
        in: filters.statuses,
      },
    })
  }

  if (filters.awardWinningOnly) {
    andClauses.push({
      awards: {
        exists: true,
      },
    })
  }

  if (andClauses.length > 0) {
    where.AND = andClauses
  }

  return where
}

function resolvePdfUrl(pub: Publication): string | null {
  const pdf = pub.pdf
  if (!pdf) return null

  if (pdf.type === 'upload' && pdf.upload) {
    if (typeof pdf.upload === 'string') {
      return null
    }

    return pdf.upload.url ?? null
  }

  if (pdf.type === 'link' && pdf.link) {
    return pdf.link
  }

  return null
}

function toFormattedPublication(pub: Publication): FormattedPublication {
  const authorsArray = pub.authors?.map((author) => ({
    teamMember: author.teamMember,
    isCoFirst: Boolean(author.isCoFirst),
  }))

  const { formatted: authorsFormatted, hasCoFirstAuthors } = formatAuthorsACM(authorsArray)

  const awards =
    pub.awards
      ?.map((award) => {
        if (!award) return null
        if (typeof award === 'string') {
          return { id: award, title: 'Award' }
        }

        return { id: award.id, title: award.title }
      })
      .filter(Boolean) ?? []

  const projects =
    pub.projects?.docs
      ?.map((project) => {
        if (!project) return null
        if (typeof project === 'string') {
          return null
        }

        return {
          id: project.id,
          title: project.title,
          slug: project.slug,
        }
      })
      .filter(Boolean) ?? []

  return {
    id: pub.id,
    title: pub.title,
    authorsFormatted,
    hasCoFirstAuthors,
    venue: pub.venueLabel ?? null,
    awards: awards as { id: string; title: string }[],
    pdfUrl: resolvePdfUrl(pub),
    citationText: pub.citationText ?? null,
    bibtex: pub.bibtex ?? null,
    projects: projects as { id: string; title: string; slug: string }[],
    externalUrl: pub.externalUrl ?? null,
  }
}

type GroupedPublications = {
  [year: number]: Publication[]
}

function sortAndGroupPublications(
  publications: Publication[],
  pinnedIds: string[],
): { yearGroups: { year: number; publications: Publication[] }[]; orderedYears: number[] } {
  const grouped: GroupedPublications = {}

  publications.forEach((pub) => {
    const yearKey = pub.year
    if (!grouped[yearKey]) grouped[yearKey] = []
    grouped[yearKey].push(pub)
  })

  const orderedYears = Object.keys(grouped)
    .map((y) => Number(y))
    .sort((a, b) => b - a)

  orderedYears.forEach((year) => {
    grouped[year].sort((a, b) => {
      const aHasAward = Boolean(a.awards && a.awards.length > 0)
      const bHasAward = Boolean(b.awards && b.awards.length > 0)

      if (aHasAward && !bHasAward) return -1
      if (!aHasAward && bHasAward) return 1

      const aDate = a.publicationDate ? new Date(a.publicationDate) : new Date(a.year, 0, 1)
      const bDate = b.publicationDate ? new Date(b.publicationDate) : new Date(b.year, 0, 1)

      return bDate.getTime() - aDate.getTime()
    })

    if (pinnedIds.length > 0) {
      const pinnedInYear = grouped[year].filter((p) => pinnedIds.includes(p.id))
      const unpinnedInYear = grouped[year].filter((p) => !pinnedIds.includes(p.id))

      pinnedInYear.sort((a, b) => pinnedIds.indexOf(a.id) - pinnedIds.indexOf(b.id))

      grouped[year] = [...pinnedInYear, ...unpinnedInYear]
    }
  })

  return {
    yearGroups: orderedYears.map((year) => ({
      year,
      publications: grouped[year],
    })),
    orderedYears,
  }
}

export const PublicationsDynamic: React.FC<PublicationsDynamicProps> = async (props) => {
  const { designVersion, filters, pinnedPublications, richText, publicContext } = props

  if (designVersion !== 'publications-dynamic') return null

  const payload = await getPayload({ config: configPromise })

  const where = buildWhereFromFilters(filters)

  const pinnedIds = (pinnedPublications ?? [])
    .map((p) => {
      if (!p) return null
      return typeof p === 'string' ? p : p.id
    })
    .filter(Boolean) as string[]

  const serverLimit =
    typeof filters?.limit === 'number' && filters.limit > 0 ? Math.max(filters.limit * 3, 50) : 500

  const result = await payload.find({
    collection: 'publications',
    where,
    depth: 2,
    limit: serverLimit,
    sort: '-year',
  })

  const docs = (result.docs as Publication[]) ?? []

  if (!docs.length) return null

  const { yearGroups } = sortAndGroupPublications(docs, pinnedIds)

  const flattened = yearGroups.flatMap((group) =>
    group.publications.map((pub) => ({ year: group.year, pub })),
  )

  const uiLimit =
    typeof filters?.limit === 'number' && filters.limit > 0 ? filters.limit : undefined

  const visibleItems = uiLimit ? flattened.slice(0, uiLimit) : flattened
  const overflowItems = uiLimit ? flattened.slice(uiLimit) : []

  const visibleByYear = new Map<number, Publication[]>()
  visibleItems.forEach(({ year, pub }) => {
    const arr = visibleByYear.get(year) ?? []
    arr.push(pub)
    visibleByYear.set(year, arr)
  })

  const overflowByYear = new Map<number, Publication[]>()
  overflowItems.forEach(({ year, pub }) => {
    const arr = overflowByYear.get(year) ?? []
    arr.push(pub)
    overflowByYear.set(year, arr)
  })

  const yearGroupsVisible = Array.from(visibleByYear.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, pubs]) => ({
      year,
      publications: pubs.map(toFormattedPublication),
    }))

  const yearGroupsOverflow = Array.from(overflowByYear.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, pubs]) => ({
      year,
      publications: pubs.map(toFormattedPublication),
    }))

  const clientProps: PublicationsDynamicClientProps = {
    publicContext,
    richText,
    yearGroups: yearGroupsVisible,
    overflowPublications: yearGroupsOverflow.flatMap((group) => group.publications),
    overflowYearGroups: yearGroupsOverflow,
  }

  return <PublicationsDynamicClient {...clientProps} />
}

export default PublicationsDynamic
