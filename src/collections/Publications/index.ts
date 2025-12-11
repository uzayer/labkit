import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { validatePublications } from './hooks/validatePublications'
import { populateAuthorPosition } from './hooks/populateAuthorPosition'
import { populateVenueLabel } from './hooks/populateVenueLabel'

/**
 * Publications - Academic papers, articles, and other scholarly works
 * Maps to schema.org: ScholarlyArticle / Article / Chapter
 * OpenAlex equivalent: Work
 *
 * Admin UX: Tabs organized for BibTeX import workflow
 * 1. Content - title, abstract, authors (what researchers write/paste)
 * 2. Publication Info - metadata typically from BibTeX
 * 3. Links & Files - PDFs and external URLs
 */
const Publications: CollectionConfig = {
  slug: 'publications',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'year', 'type', 'venueLabel', 'featured'],
    useAsTitle: 'title',
    group: 'Research',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // TAB 1: Content - Primary entry point
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'abstract',
              type: 'textarea',
              admin: {
                description: 'Publication abstract - critical for SEO and schema.org',
              },
            },
            {
              name: 'keywords',
              type: 'relationship',
              relationTo: 'keywords',
              hasMany: true,
              admin: {
                description: 'Concepts or keywords (e.g., "Fitts\' Law", "VR")',
              },
            },
            {
              name: 'authors',
              label: 'Authors',
              type: 'array',
              minRows: 1,
              required: true, // Array itself is still required
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'teamMember',
                      type: 'relationship',
                      relationTo: 'team',
                      required: false, // Changed to false
                      admin: {
                        width: '50%',
                        description: 'Select a team member for this author entry',
                        condition: (_, siblingData) => !siblingData?.customAuthor, // Show if no custom author
                      },
                      // Custom validation to ensure either teamMember or customAuthor exists
                      validate: (val, { siblingData }) => {
                        if (!val && !siblingData?.customAuthor) {
                          return 'Either select a team member or provide a custom author name.'
                        }
                        return true
                      },
                    },
                    {
                      name: 'customAuthor',
                      label: 'Custom Author Name',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description:
                          'Enter if author is not a team member (e.g., external collaborator).',
                        condition: (_, siblingData) => !siblingData?.teamMember, // Show if no team member selected
                      },
                    },
                  ],
                },
                {
                  name: 'authorPosition',
                  type: 'number',
                  min: 1,
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: 'isCoFirst',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Co-first author (equal contribution)',
                  },
                },
                {
                  name: 'isCorresponding',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Corresponding author for this publication',
                  },
                },
              ],
              admin: {
                description:
                  'Drag to reorder. Each author must either be a Team member or have a custom name.',
                initCollapsed: false,
              },
            },

            // BibTeX import section - placeholder for future parser integration
            {
              type: 'collapsible',
              label: 'BibTeX Import',
              admin: {
                initCollapsed: true,
                description: 'Paste BibTeX to auto-fill publication metadata',
              },
              fields: [
                {
                  name: 'bibtex',
                  type: 'textarea',
                  admin: {
                    description:
                      'Paste BibTeX entry here. Future: "Parse & Auto-fill" button will populate fields.',
                    rows: 6,
                  },
                },
              ],
            },
          ],
        },

        // TAB 2: Publication Info - Metadata (often from BibTeX)
        {
          label: 'Publication Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                  index: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'published',
                  options: [
                    { label: 'Published', value: 'published' },
                    { label: 'Accepted/In Press', value: 'accepted-in-press' },
                    { label: 'Submitted', value: 'submitted' },
                    { label: 'Preprint', value: 'preprint' },
                  ],
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  index: true,
                  options: [
                    { label: 'Conference', value: 'conference' },
                    { label: 'Journal', value: 'journal' },
                    { label: 'Workshop', value: 'workshop' },
                    { label: 'Preprint', value: 'preprint' },
                    { label: 'Extended Abstract', value: 'extended-abstract' },
                    { label: 'Study Protocol', value: 'study-protocol' },
                    { label: 'Book Chapter', value: 'book-chapter' },
                  ],
                  admin: {
                    width: '33%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'publicationDate',
                  type: 'date',
                  index: true,
                  admin: {
                    description: 'Exact date (for sorting)',
                    width: '50%',
                  },
                },
                {
                  name: 'acceptanceDate',
                  type: 'date',
                  admin: {
                    description: 'Acceptance date',
                    width: '50%',
                    condition: (data) => data?.status === 'accepted-in-press',
                  },
                },
              ],
            },
            // Venue group
            {
              type: 'collapsible',
              label: 'Venue',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'venue',
                  type: 'relationship',
                  relationTo: 'venues',
                  admin: {
                    description: 'Select from Venues lookup (optional)',
                  },
                },
                {
                  name: 'venueLabel',
                  label: 'Venue Display Name',
                  type: 'text',
                  admin: {
                    description:
                      'Displayed name (e.g., "CHI \'24"). Auto-filled from venue if empty.',
                  },
                },
                {
                  name: 'location',
                  label: 'Conference Location',
                  type: 'text',
                  admin: {
                    description: 'City, Country (e.g., "Honolulu, HI, USA")',
                    condition: (data) => data?.type === 'conference' || data?.type === 'workshop',
                  },
                },
              ],
            },
            // Citation details
            {
              type: 'collapsible',
              label: 'Citation Details',
              admin: {
                initCollapsed: true,
                description: 'For journals: volume, issue, pages',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'volume',
                      type: 'text',
                      admin: {
                        placeholder: 'Vol.',
                        width: '25%',
                      },
                    },
                    {
                      name: 'issue',
                      type: 'text',
                      admin: {
                        placeholder: 'Issue',
                        width: '25%',
                      },
                    },
                    {
                      name: 'pageStart',
                      type: 'text',
                      admin: {
                        placeholder: 'Start page',
                        width: '25%',
                      },
                    },
                    {
                      name: 'pageEnd',
                      type: 'text',
                      admin: {
                        placeholder: 'End page',
                        width: '25%',
                      },
                    },
                  ],
                },
                {
                  name: 'citationText',
                  type: 'text',
                  admin: {
                    description: 'Full citation string (APA/MLA) - auto-generated if empty',
                  },
                },
              ],
            },
          ],
        },

        // TAB 3: Links & Files
        {
          label: 'Links & Files',
          fields: [
            {
              name: 'doi',
              label: 'DOI',
              type: 'text',
              admin: {
                description: 'e.g., 10.1145/1234567.1234568',
                placeholder: '10.1000/182',
              },
              validate: (value) => {
                if (!value) return true
                const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
                if (!doiRegex.test(value)) {
                  return 'Invalid DOI format. Expected format: 10.xxxx/xxxxx'
                }
                return true
              },
            },
            {
              name: 'externalUrl',
              label: 'Publisher URL',
              type: 'text',
              admin: {
                description: 'Link to publisher, ACM DL, arXiv, etc.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'isOpenAccess',
                  label: 'Open Access',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Is this publication freely accessible?',
                    width: '30%',
                  },
                },
                {
                  name: 'license',
                  type: 'select',
                  options: [
                    { label: 'All Rights Reserved', value: 'all-rights-reserved' },
                    { label: 'CC BY', value: 'cc-by' },
                    { label: 'CC BY-SA', value: 'cc-by-sa' },
                    { label: 'CC BY-NC', value: 'cc-by-nc' },
                    { label: 'CC BY-NC-SA', value: 'cc-by-nc-sa' },
                    { label: 'CC BY-ND', value: 'cc-by-nd' },
                    { label: 'CC BY-NC-ND', value: 'cc-by-nc-nd' },
                    { label: 'CC0 (Public Domain)', value: 'cc0' },
                  ],
                  admin: {
                    description: 'Publication license',
                    width: '70%',
                  },
                },
              ],
            },
            {
              name: 'pdf',
              type: 'group',
              label: 'PDF',
              admin: {
                hideGutter: true,
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  options: [
                    { label: 'Upload PDF', value: 'upload' },
                    { label: 'Link to PDF', value: 'link' },
                  ],
                  defaultValue: 'upload',
                },
                {
                  name: 'upload',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'upload',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'link',
                    placeholder: 'https://...',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // SIDEBAR FIELDS
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
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
      name: 'awards',
      type: 'relationship',
      relationTo: 'awards',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'projects',
      type: 'join',
      collection: 'projects',
      on: 'publications',
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
    // OpenAlex integration - hidden until populated
    {
      type: 'collapsible',
      label: 'OpenAlex Data',
      admin: {
        position: 'sidebar',
        initCollapsed: true,
        // condition: (data) => Boolean(data?.openalex_id), // Show only when synced
      },
      fields: [
        {
          name: 'openalex_id',
          label: 'OpenAlex ID',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'Auto-populated by sync',
          },
        },
        {
          name: 'citationCount',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'citationCountUpdatedAt',
          type: 'date',
          admin: {
            readOnly: true,
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [validatePublications, populateAuthorPosition, populateVenueLabel],
    afterChange: [],
    afterRead: [],
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

export default Publications
