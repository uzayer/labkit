import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { hasPermission } from '@/utilities/checkPermission'
import { validateAwards } from './hooks/validateAwards'
import { populateOrganizationLabel } from './hooks/populateOrganizationLabel'
import { provenanceFields } from '@/fields/provenance'

/**
 * Awards - Recognition for publications and projects
 * Maps to schema.org: Award property on CreativeWork
 */
const Awards: CollectionConfig = {
  slug: 'awards',
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: anyone,
    update: hasPermission('canManageContent'),
  },
  admin: {
    useAsTitle: 'title',
    group: 'Research',
    defaultColumns: ['title', 'organization', 'category', 'year'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Award name (e.g., "Best Paper Award")',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
          index: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'endYear',
          type: 'number',
          admin: {
            description: 'For multi-year honors (e.g., fellowships)',
            width: '25%',
          },
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Best Paper', value: 'best-paper' },
            { label: 'Honorable Mention', value: 'honorable-mention' },
            { label: 'Best Presentation', value: 'best-presentation' },
            { label: 'Best Demo', value: 'best-demo' },
            { label: 'Best Poster', value: 'best-poster' },
            { label: 'Impact', value: 'impact' },
            { label: 'Research Grant', value: 'research-grant' },
            { label: 'Scholarship', value: 'scholarship' },
            { label: 'Recognition', value: 'recognition' },
            { label: 'Fellowship', value: 'fellowship' },
            { label: 'Competition', value: 'competition' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'scope',
      type: 'select',
      defaultValue: 'lab',
      options: [
        { label: 'Lab', value: 'lab' },
        { label: 'Personal', value: 'personal' },
      ],
      admin: {
        description: 'Lab-wide recognition vs. a personal honor for one recipient',
      },
    },
    {
      name: 'recipients',
      type: 'array',
      admin: {
        description:
          'Who received this award. Each row is either a Team member or an external name.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'teamMember',
              type: 'relationship',
              relationTo: 'team',
              admin: {
                width: '50%',
                description: 'Select a team member',
                condition: (_, siblingData) => !siblingData?.customRecipient?.name,
              },
              validate: (val, { siblingData }) => {
                if (!val && !siblingData?.customRecipient?.name) {
                  return 'Either select a team member or provide a custom recipient name.'
                }
                return true
              },
            },
            {
              name: 'customRecipient',
              label: 'Custom Recipient',
              type: 'group',
              admin: {
                width: '50%',
                description:
                  'Enter if recipient is not a team member (e.g., external collaborator).',
                condition: (_, siblingData) => !siblingData?.teamMember,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  admin: {
                    description: 'Full name as it appears on the award record.',
                  },
                },
                {
                  name: 'orcid',
                  label: 'ORCID',
                  type: 'text',
                  admin: {
                    description: 'ORCID identifier, if known.',
                    placeholder: '0000-0002-1825-0097',
                  },
                },
                {
                  name: 'dblpPid',
                  label: 'DBLP PID',
                  type: 'text',
                  admin: {
                    description: 'DBLP author identifier, if known (CS venues only).',
                    placeholder: '73/10485',
                  },
                },
                {
                  name: 'affiliation',
                  type: 'relationship',
                  relationTo: 'organizations',
                  admin: {
                    description: 'Institutional affiliation, if known.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // Granting organization group
    {
      type: 'collapsible',
      label: 'Granting Organization',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'organization',
          type: 'relationship',
          relationTo: 'organizations',
          admin: {
            description: 'Select from Organizations',
          },
        },
        {
          name: 'organizationLabel',
          label: 'Or enter name manually',
          type: 'text',
          admin: {
            description: 'Use if organization is not in the lookup table (e.g., "ACM CHI")',
          },
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Link to award announcement',
      },
    },
    // Sidebar fields
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage',
        position: 'sidebar',
      },
    },
    {
      name: 'projects',
      type: 'join',
      collection: 'projects',
      on: 'awards',
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'publications',
      type: 'join',
      collection: 'publications',
      on: 'awards',
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
    provenanceFields(),
  ],
  hooks: {
    beforeChange: [validateAwards, populateOrganizationLabel],
  },
}

export default Awards
