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
    description:
      "The Lab's identity, contact details and site copy. Also used for SEO and schema.org markup.",
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
      admin: {
        description: 'Full lab name',
      },
    },
    {
      name: 'shortName',
      type: 'text',
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

    // Site copy: the prose a Lab's site shows that no record holds. Contact
    // details, socials, logo and the recruitment window are their own fields below.
    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'One line on what the Lab does. The home page leads with it.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'A short paragraph under the headline on the home page.',
      },
    },
    {
      name: 'about',
      type: 'richText',
      admin: {
        description: 'The About page: what the Lab does, how it works, its history.',
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
        },
        {
          name: 'country',
          type: 'text',
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
            { label: 'X (Twitter)', value: 'x' },
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
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

    // Curated Organization lists. Ordered relationships rather than per-record
    // flags, because the order is editorial (the home logo strip reads left
    // to right) and a checkbox on Organization cannot express it.
    {
      name: 'homePartners',
      type: 'relationship',
      relationTo: 'organizations',
      hasMany: true,
      admin: {
        description:
          'Organizations shown in the home page partner strip, in display order. Give each a logo.',
      },
    },
    {
      name: 'collaborators',
      type: 'relationship',
      relationTo: 'organizations',
      hasMany: true,
      admin: {
        description: 'Organizations listed as collaborating institutions, in display order',
      },
    },

    // Recruitment
    {
      name: 'recruitment',
      type: 'group',
      admin: {
        description:
          'Current recruitment window shown on Join Us. Leave both empty when none is announced.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'opens',
              type: 'date',
              admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
            },
            {
              name: 'closes',
              type: 'date',
              admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
              validate: (value, { siblingData }) => {
                const opens = (siblingData as { opens?: string | null })?.opens
                if (value && opens && new Date(value) < new Date(opens)) {
                  return 'Closing date must be on or after the opening date.'
                }
                return true
              },
            },
          ],
        },
      ],
    },
    {
      name: 'joinUs',
      label: 'Join Us',
      type: 'richText',
      admin: {
        description:
          'The Join Us page: who can join and how to apply. The apply link uses the contact email above.',
      },
    },

    {
      name: 'onboardingCompleted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateLabInfo],
  },
  versions: false,
  authorship: false,
}
