import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'

/**
 * ImportRuns - immutable history of ingestion pipeline runs (dashboard + CLI).
 * A run is staged (candidate snapshot), then run (job processes candidates),
 * then completed/failed/cancelled. See docs/product/ROADMAP.md ingestion section.
 */
const ImportRuns: CollectionConfig = {
  slug: 'import-runs',
  labels: {
    singular: 'Import Run',
    plural: 'Import Runs',
  },
  admin: {
    group: 'Import',
    useAsTitle: 'label',
    defaultColumns: ['label', 'source', 'status', 'createdAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable label (e.g., "ORCID import — 0000-0002-1825-0097")',
      },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'ORCID', value: 'orcid' },
        { label: 'BibTeX', value: 'bibtex' },
        { label: 'Citation paste', value: 'citations' },
        { label: 'DOI quick-add', value: 'doi' },
        { label: 'CLI', value: 'cli' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'staged',
      index: true,
      options: [
        { label: 'Staged', value: 'staged' },
        { label: 'Running', value: 'running' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'params',
      type: 'json',
      admin: {
        description: 'Source-specific input params (e.g., {orcid} or {doi})',
      },
    },
    {
      name: 'rawInput',
      type: 'textarea',
      admin: {
        description: 'Raw pasted BibTeX/citation text, if applicable. Runs stay self-describing.',
      },
    },
    {
      name: 'candidates',
      type: 'json',
      admin: {
        description: 'Staged snapshot: [{key, title, year, doi?, note?, selected, status}]',
      },
    },
    {
      name: 'progress',
      type: 'group',
      fields: [
        { name: 'total', type: 'number', defaultValue: 0 },
        { name: 'processed', type: 'number', defaultValue: 0 },
        { name: 'created', type: 'number', defaultValue: 0 },
        { name: 'skippedExisting', type: 'number', defaultValue: 0 },
        { name: 'failed', type: 'number', defaultValue: 0 },
      ],
    },
    {
      // Lease lock for the import-hydrate job — prevents two queued jobs from
      // processing the same run concurrently (duplicate queue entries, manual
      // requeues, overlapping cron ticks). Claimed via a conditional
      // db.updateOne compare-and-swap; the holder refreshes heartbeatAt on
      // every candidate checkpoint, and a lease whose heartbeat has gone
      // stale can be taken over (the holding worker died mid-batch).
      name: 'lock',
      type: 'group',
      admin: { hidden: true },
      fields: [
        { name: 'token', type: 'text' },
        { name: 'heartbeatAt', type: 'date' },
      ],
    },
    {
      name: 'reportSummary',
      type: 'json',
      admin: {
        description: 'Finalized ImportReport.toJSON() snapshot',
      },
    },
    {
      name: 'error',
      type: 'text',
    },
    {
      name: 'startedAt',
      type: 'date',
    },
    {
      name: 'finishedAt',
      type: 'date',
    },
  ],
  versions: false,
  authorship: false,
}

export default ImportRuns
