import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { hasPermission } from '../../utilities/checkPermission'
import { slugField } from '../../fields/slug'
import { provenanceFields } from '../../fields/provenance'
import { revalidateGrant } from './hooks/revalidateGrant'
import { populateFunderLabel } from './hooks/populateFunderLabel'

/**
 * Grants - Research funding and awards
 * Maps to schema.org: Grant / MonetaryGrant
 * OpenAlex equivalent: Funder relationship on Works
 */
const Grants: CollectionConfig = {
  slug: 'grants',
  labels: {
    singular: 'Grant',
    plural: 'Grants',
  },
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: anyone,
    update: hasPermission('canManageContent'),
  },
  admin: {
    group: 'Research',
    useAsTitle: 'title',
    defaultColumns: ['title', 'funder', 'status', 'startDate'],
    description: 'Research grants and funding sources',
  },
  fields: [
    // Title
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Grant title or project name',
      },
    },
    ...slugField(),
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the funded work',
      },
    },

    // Funder - relationship with fallback
    {
      name: 'funder',
      type: 'relationship',
      relationTo: 'organizations',
      admin: {
        description: 'Select from Organizations lookup',
      },
      validate: (value, { data }) => {
        if (!value && !data?.funderLabel) {
          return 'Select a funder or enter a name in the fallback field'
        }
        return true
      },
    },
    {
      name: 'funderLabel',
      label: 'Funder Name (Fallback)',
      type: 'text',
      admin: {
        description: 'Use if funder is not in the Organizations lookup',
      },
    },

    // Grant details row
    {
      type: 'row',
      fields: [
        {
          name: 'grantNumber',
          type: 'text',
          admin: {
            description: 'Official grant/award number',
            width: '50%',
          },
        },
        {
          name: 'amountValue',
          label: 'Amount',
          type: 'number',
          min: 0,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'amountCurrency',
          label: 'Currency',
          type: 'select',
          defaultValue: 'USD',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'BDT', value: 'BDT' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
          ],
          admin: {
            width: '20%',
          },
        },
      ],
    },
    {
      name: 'amountLabel',
      type: 'text',
      admin: {
        description:
          'Amount as the source states it, when it cannot be a number (e.g. "5 lac"). Shown only when Amount is empty.',
      },
    },

    // Timeline row
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            width: '50%',
          },
        },
      ],
    },

    // Investigators
    {
      name: 'investigators',
      type: 'array',
      admin: {
        description: 'Principal investigators and collaborators',
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
                width: '40%',
                description: 'Select a team member',
                condition: (_, siblingData) => !siblingData?.customInvestigator?.name,
              },
              validate: (val, { siblingData }) => {
                if (!val && !siblingData?.customInvestigator?.name) {
                  return 'Either select a team member or provide a custom investigator name.'
                }
                return true
              },
            },
            {
              name: 'customInvestigator',
              label: 'Custom Investigator',
              type: 'group',
              admin: {
                width: '30%',
                description: 'Enter if investigator is not a team member (e.g., external PI).',
                condition: (_, siblingData) => !siblingData?.teamMember,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  admin: {
                    description: 'Full name as it appears on the grant record.',
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
                {
                  name: 'affiliationLabel',
                  type: 'text',
                  admin: {
                    description:
                      'Affiliation as free text, when no Organization record exists (e.g. an OpenAlex affiliation without a ROR ID).',
                  },
                },
              ],
            },
            {
              name: 'role',
              type: 'select',
              defaultValue: 'pi',
              options: [
                { label: 'PI', value: 'pi' },
                { label: 'Co-PI', value: 'co-pi' },
                { label: 'Collaborator', value: 'collaborator' },
              ],
              admin: {
                width: '30%',
              },
            },
          ],
        },
      ],
    },

    // External URL
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Link to grant announcement or project page',
      },
    },

    // SIDEBAR FIELDS
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Pending', value: 'pending' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
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
      name: 'themes',
      type: 'relationship',
      relationTo: 'research-themes',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'projects',
      type: 'join',
      collection: 'projects',
      on: 'grants',
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
    provenanceFields(),
  ],
  hooks: {
    beforeChange: [populateFunderLabel],
    afterChange: [revalidateGrant],
  },
  versions: false,
  authorship: false,
}

export default Grants
