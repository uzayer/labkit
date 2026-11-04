import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { hasPermission } from '@/utilities/checkPermission'
import { warnDuplicateVenue } from './hooks/warnDuplicateVenue'

/**
 * Venues - Lightweight lookup table for publication venues (conferences, journals)
 * Maps to schema.org: Periodical (journals), Event (conferences)
 * OpenAlex equivalent: Source
 */
const Venues: CollectionConfig = {
  slug: 'venues',
  labels: {
    singular: 'Venue',
    plural: 'Venues',
  },
  admin: {
    group: 'Reference Data',
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortName', 'type'],
    description: 'Conferences, journals, and other publication venues',
  },
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: anyone,
    update: hasPermission('canManageContent'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description:
          'Full venue name (e.g., "ACM CHI Conference on Human Factors in Computing Systems")',
      },
    },
    {
      name: 'shortName',
      type: 'text',
      admin: {
        description: 'Common abbreviation (e.g., "CHI", "JAMA", "NeurIPS")',
      },
    },
    {
      name: 'alternateNames',
      type: 'text',
      hasMany: true,
      admin: {
        description:
          'Other names this venue appears under (e.g., full conference proceedings title from Crossref). Used for ingestion matching.',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Conference', value: 'conference' },
        { label: 'Journal', value: 'journal' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Book Series', value: 'book-series' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Venue type (determines schema.org @type)',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Venue website',
      },
    },
    {
      name: 'issn',
      label: 'ISSN',
      type: 'text',
      hasMany: true,
      index: true,
      admin: {
        description:
          'International Standard Serial Number(s) for this venue — print and electronic editions often have different ISSNs. Not unique; a single value can be shared across editions.',
      },
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'organizations',
      admin: {
        description: 'Publishing organization (e.g., ACM, IEEE, Springer)',
      },
    },
    {
      name: 'wikidata_id',
      label: 'Wikidata ID',
      type: 'text',
      admin: {
        description: 'Wikidata Q-number for disambiguation (e.g., Q123456)',
        position: 'sidebar',
      },
    },
    {
      name: 'openalex_id',
      label: 'OpenAlex ID',
      type: 'text',
      unique: true,
      admin: {
        description: 'OpenAlex source identifier for future sync',
        position: 'sidebar',
      },
    },
    // Joins - see publications in this venue
    {
      name: 'publications',
      type: 'join',
      collection: 'publications',
      on: 'venue',
      admin: {
        description: 'Publications in this venue',
        position: 'sidebar',
        allowCreate: false,
      },
    },
  ],
  hooks: {
    beforeChange: [warnDuplicateVenue],
  },
  // No versions - simple lookup table
  versions: false,
  authorship: false,
}

export default Venues
