import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { hasPermission } from '../../utilities/checkPermission'
import { provenanceFields } from '../../fields/provenance'
import { warnDuplicateOrganization } from './hooks/warnDuplicateOrganization'

/**
 * Organizations - Lightweight lookup table for institutions, funders, publishers
 * Maps to schema.org: Organization, ResearchOrganization, EducationalOrganization, FundingAgency
 * OpenAlex equivalent: Institution
 */
const Organizations: CollectionConfig = {
  slug: 'organizations',
  labels: {
    singular: 'Organization',
    plural: 'Organizations',
  },
  admin: {
    group: 'Reference Data',
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortName', 'type'],
    description: 'Institutions, funders, and publishers referenced across the site',
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
        description: 'Full organization name',
      },
    },
    {
      name: 'shortName',
      type: 'text',
      admin: {
        description: 'Acronym or abbreviation (e.g., "NSF", "MIT", "ACM")',
      },
    },
    {
      name: 'alternateNames',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Other names this organization appears under. Used for ingestion matching.',
      },
    },
    {
      name: 'country',
      type: 'text',
      admin: {
        description: 'Country (e.g., "Bangladesh", "USA")',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'University', value: 'university' },
        { label: 'Research Institute', value: 'research-institute' },
        { label: 'Funding Agency', value: 'funding-agency' },
        { label: 'Company', value: 'company' },
        { label: 'Government', value: 'government' },
        { label: 'Publisher', value: 'publisher' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Organization type (determines schema.org @type)',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Organization website',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          "The organization's own mark, shown in the partner strip. Prefer SVG or a transparent PNG.",
      },
    },
    {
      name: 'ror_id',
      label: 'ROR ID',
      type: 'text',
      unique: true,
      admin: {
        description: 'Research Organization Registry identifier (e.g., "https://ror.org/...")',
      },
    },
    {
      name: 'openalex_id',
      label: 'OpenAlex ID',
      type: 'text',
      unique: true,
      admin: {
        description: 'OpenAlex institution identifier for future sync',
        position: 'sidebar',
      },
    },
    // Joins - see what references this organization
    {
      name: 'grants',
      type: 'join',
      collection: 'grants',
      on: 'funder',
      admin: {
        description: 'Grants funded by this organization',
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'teamMembers',
      type: 'join',
      collection: 'team',
      on: 'affiliation',
      admin: {
        description: 'Team members affiliated with this organization',
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'awards',
      type: 'join',
      collection: 'awards',
      on: 'organization',
      admin: {
        description: 'Awards given by this organization',
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'venues',
      type: 'join',
      collection: 'venues',
      on: 'publisher',
      admin: {
        description: 'Venues published by this organization',
        position: 'sidebar',
        allowCreate: false,
      },
    },
    provenanceFields(),
  ],
  hooks: {
    beforeChange: [warnDuplicateOrganization],
  },
  // No versions - simple lookup table
  versions: false,
  authorship: false,
}

export default Organizations
