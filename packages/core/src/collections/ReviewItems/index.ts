import type { CollectionConfig } from 'payload'

import { isAdmin } from '../../access/isAdmin'

/**
 * ReviewItems - work queue surfaced by the ingestion engine for human review
 * (unmatched venues/orgs, person-merge suggestions, no-DOI works, unparsed
 * citations, unmapped types, failed DOIs). Different lifecycle than ImportRuns
 * (immutable history) — this is a mutable queue that gets worked down.
 */
const ReviewItems: CollectionConfig = {
  slug: 'review-items',
  labels: {
    singular: 'Review Item',
    plural: 'Review Items',
  },
  admin: {
    group: 'Import',
    useAsTitle: 'value',
    defaultColumns: ['kind', 'value', 'status', 'createdAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Unmatched venue', value: 'unmatched-venue' },
        { label: 'Unmatched organization', value: 'unmatched-org' },
        { label: 'Person merge suggestion', value: 'person-merge-suggestion' },
        { label: 'No-DOI work', value: 'no-doi-work' },
        { label: 'Unparsed citation', value: 'unparsed-citation' },
        { label: 'Unmapped type', value: 'unmapped-type' },
        { label: 'Failed DOI', value: 'failed-doi' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      index: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Dismissed', value: 'dismissed' },
      ],
    },
    {
      name: 'run',
      type: 'relationship',
      relationTo: 'import-runs',
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      admin: {
        description: 'Display string for the review queue table',
      },
    },
    {
      name: 'sourceContext',
      type: 'text',
      admin: {
        description: 'Where this came from (e.g., a paper title or citation snippet)',
      },
    },
    {
      name: 'data',
      type: 'json',
      admin: {
        description:
          'Kind-specific payload, e.g. person-merge-suggestion: {newTeamId, existingTeamId, score}',
      },
    },
    {
      name: 'resolution',
      type: 'json',
    },
    {
      name: 'resolvedAt',
      type: 'date',
    },
  ],
  versions: false,
  authorship: false,
}

export default ReviewItems
