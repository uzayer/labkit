import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { hasPermission } from '@/utilities/checkPermission'
import { slugField } from '@/fields/slug'

const Keywords: CollectionConfig = {
  slug: 'keywords',
  labels: {
    singular: 'Keyword',
    plural: 'Keywords',
  },
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: authenticatedOrPublished,
    update: hasPermission('canManageContent'),
  },
  admin: {
    group: 'Reference Data',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'openAlexId'],
    description: 'Reusable keywords and research concepts',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The keyword name (e.g., "Human-Computer Interaction", "Fitts\' Law")',
      },
    },
    ...slugField(),
    {
      name: 'openAlexId',
      label: 'OpenAlex ID',
      type: 'text',
      admin: {
        description: 'OpenAlex concept identifier for future sync',
        position: 'sidebar',
      },
    },
    // Joins - see what uses this keyword
    {
      name: 'publications',
      type: 'join',
      collection: 'publications',
      on: 'keywords',
      admin: {
        description: 'Publications tagged with this keyword',
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'teamMembers',
      type: 'join',
      collection: 'team',
      on: 'researchInterests',
      admin: {
        description: 'Team members with this research interest',
        position: 'sidebar',
        allowCreate: false,
      },
    },
  ],
}

export default Keywords
