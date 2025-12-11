import type { GlobalConfig } from 'payload'

import { revalidateLabInfo } from './hooks/revalidateLabInfo'

/**
 * LabInfo - Global configuration for the research lab
 * Maps to schema.org: ResearchOrganization
 * This provides the root organization context for all JSON-LD output
 */
export const LabInfo: GlobalConfig = {
  slug: 'lab-info',
  label: 'Lab Info',
  admin: {
    group: 'Settings',
    description: 'Core information about the lab for SEO and schema.org markup',
  },
  access: {
    read: () => true,
  },
  fields: [
    // Identity
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'DIAL Lab',
      admin: {
        description: 'Full lab name',
      },
    },
    {
      name: 'shortName',
      type: 'text',
      defaultValue: 'DIAL',
      admin: {
        description: 'Acronym or short name',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description for SEO and schema.org (1-2 sentences)',
      },
    },

    // Parent Institution
    {
      name: 'parentOrganization',
      type: 'group',
      admin: {
        description: 'The university or institution the lab belongs to',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: 'North South University',
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Institution website',
          },
        },
        {
          name: 'department',
          type: 'text',
          admin: {
            description: 'Department or school (e.g., "Department of ECE")',
          },
        },
      ],
    },

    // Contact
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Lab contact email',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Lab website URL (canonical, used in schema.org)',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Lab logo for schema.org and social sharing',
      },
    },

    // Location
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
          admin: {
            description: 'Street address (optional)',
          },
        },
        {
          name: 'city',
          type: 'text',
          defaultValue: 'Dhaka',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'Bangladesh',
        },
      ],
    },

    // Social/External Links
    {
      name: 'socials',
      type: 'array',
      admin: {
        description: 'Social media and external profiles (used for schema.org sameAs)',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Google Scholar', value: 'google-scholar' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'ResearchGate', value: 'researchgate' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },

    // Identifiers for Linked Data
    {
      name: 'identifiers',
      type: 'group',
      admin: {
        description: 'External identifiers for linked data and schema.org sameAs',
      },
      fields: [
        {
          name: 'ror_id',
          label: 'ROR ID',
          type: 'text',
          admin: {
            description: 'Research Organization Registry identifier',
          },
        },
        {
          name: 'wikidata_id',
          label: 'Wikidata ID',
          type: 'text',
          admin: {
            description: 'Wikidata Q-number (e.g., Q123456)',
          },
        },
        {
          name: 'openalex_id',
          label: 'OpenAlex ID',
          type: 'text',
          admin: {
            description: 'OpenAlex institution identifier',
          },
        },
      ],
    },

    // Founding
    {
      name: 'foundingDate',
      type: 'date',
      admin: {
        description: 'When was the lab established?',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateLabInfo],
  },
}
