import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { hasPermission } from '@/utilities/checkPermission'
import { validateAwards } from './hooks/validateAwards'
import { populateOrganizationLabel } from './hooks/populateOrganizationLabel'

/**
 * Awards - Recognition for publications and projects
 * Maps to schema.org: Award property on CreativeWork
 */
const Awards: CollectionConfig = {
  slug: 'awards',
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: authenticatedOrPublished,
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
            width: '30%',
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
            { label: 'Other', value: 'other' },
          ],
          admin: {
            width: '70%',
          },
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
    // Sidebar - join fields
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
  ],
  hooks: {
    beforeChange: [validateAwards, populateOrganizationLabel],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
    maxPerDoc: 50,
  },
}

export default Awards
