import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { hasPermission } from '../../utilities/checkPermission'
import { slugField } from '../../fields/slug'
import { provenanceFields } from '../../fields/provenance'
import { isValidExternalHttpUrl } from '../../utilities/validation'

/**
 * News - The Lab's dated announcements: papers accepted, events held,
 * community work. Backs `/news` and `/news/[slug]` (ADR-0002).
 * Maps to schema.org: NewsArticle / Event
 *
 * Deliberately lean — a title, a date, a paragraph. Not a blog: `Posts` stays
 * the template's long-form collection and is not used for this.
 */
const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'News Item',
    plural: 'News',
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
    defaultColumns: ['title', 'type', 'date'],
    description: 'Dated announcements shown on the News page',
  },
  defaultSort: '-date',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          index: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'datePrecision',
          type: 'select',
          required: true,
          defaultValue: 'day',
          options: [
            { label: 'Exact day', value: 'day' },
            { label: 'Month only', value: 'month' },
            { label: 'Year only', value: 'year' },
          ],
          admin: {
            width: '50%',
            description:
              'How much of the date the source actually states. The site never prints a day or month that was not given.',
          },
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Academic', value: 'academic' },
        { label: 'Event', value: 'event' },
        { label: 'Community', value: 'community' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        rows: 4,
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'url',
      label: 'Link',
      type: 'text',
      validate: (value) => {
        if (!value) return true
        return isValidExternalHttpUrl(value) || 'Link must be a valid http:// or https:// URL.'
      },
      admin: {
        description: 'Optional external link (announcement, event page, press coverage)',
      },
    },
    provenanceFields(),
  ],
  versions: false,
  authorship: false,
}

export default News
