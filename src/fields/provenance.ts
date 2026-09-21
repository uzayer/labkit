import type { Field } from 'payload'

/**
 * Sidebar group tracking how a record entered the system — manual entry vs.
 * one of the ingestion pipelines. Lets imported records stay auditable
 * (original citation string, when it was pulled, which API answered).
 */
export const provenanceFields = (): Field => ({
  type: 'collapsible',
  label: 'Provenance',
  admin: {
    position: 'sidebar',
    initCollapsed: true,
  },
  fields: [
    {
      name: 'provenance',
      type: 'group',
      admin: {
        hideGutter: true,
        // Written by the ingestion scripts (Local API, overrideAccess) — an audit
        // trail, not something to hand-edit. Read-only in the admin UI only, deliberately not
        // field-level access, so the Local API writers are unaffected.
        readOnly: true,
      },
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'manual',
          options: [
            { label: 'Manual', value: 'manual' },
            { label: 'Crossref', value: 'crossref' },
            { label: 'OpenAlex', value: 'openalex' },
            { label: 'BibTeX', value: 'bibtex' },
            { label: 'Scrape', value: 'scrape' },
          ],
        },
        {
          name: 'importedAt',
          type: 'date',
          admin: {
            description: 'When this record was last written by an ingestion script',
          },
        },
        {
          name: 'sourceNote',
          type: 'textarea',
          admin: {
            description: 'Original citation string, source URL, or other import notes',
          },
        },
      ],
    },
  ],
})
