import type { CollectionConfig } from 'payload'

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
    read: () => true,
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
      name: 'ror_id',
      label: 'ROR ID',
      type: 'text',
      admin: {
        description: 'Research Organization Registry identifier (e.g., "https://ror.org/...")',
      },
    },
    {
      name: 'openalex_id',
      label: 'OpenAlex ID',
      type: 'text',
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
  ],
  hooks: {
    beforeChange: [warnDuplicateOrganization],
  },
  // No versions - simple lookup table
}

export default Organizations
