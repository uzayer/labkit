import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { hasPermission } from '@/utilities/checkPermission'
import { slugField } from '@/fields/slug'
import { validateResearchThemes } from './hooks/validateResearchThemes'

const ResearchThemes: CollectionConfig = {
  slug: 'research-themes',
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: authenticatedOrPublished,
    update: hasPermission('canManageContent'),
  },
  admin: {
    defaultColumns: ['title', 'slug', 'featured'],
    useAsTitle: 'title',
    group: 'Research',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Summarizes theme; displayed on Research landing page',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'For highlighting on homepage / research landing page',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional icon for visual display in grid or blocks',
      },
    },
    {
      name: 'projects',
      type: 'join',
      collection: 'projects',
      on: 'themes',
      admin: {
        description: 'Projects that represent this theme',
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'publications',
      type: 'join',
      collection: 'publications',
      on: 'themes',
      admin: {
        description: 'Publications tagged with this theme',
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'grants',
      type: 'join',
      collection: 'grants',
      on: 'themes',
      admin: {
        description: 'Grants supporting this research theme',
        position: 'sidebar',
        allowCreate: false,
      },
    },
  ],
  hooks: {
    beforeChange: [validateResearchThemes],
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

export default ResearchThemes
