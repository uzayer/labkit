import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { hasPermission } from '@/utilities/checkPermission'
import { slugField } from '@/fields/slug'
import { populateRoleLabel } from './hooks/populateRoleLabel'
import { setDisplayInTeam } from './hooks/setDisplayInTeam'
import { validateTeamMembers } from './hooks/validateTeamMembers'
import { populateFullName } from './hooks/populateFullName' // New import

/**
 * Team - Lab members, collaborators, and alumni
 * Maps to schema.org: Person
 * OpenAlex equivalent: Author
 *
 * Admin UX: Two tabs - Profile (public) and Identifiers (technical)
 */
const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Team Member',
    plural: 'Team',
  },
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: authenticatedOrPublished,
    update: hasPermission('canManageContent'),
  },
  admin: {
    defaultColumns: ['name', 'role', 'title', 'displayInWebsite'],
    useAsTitle: 'name',
    group: 'Research',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // TAB 1: Profile - Public-facing information
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: false, // Changed to false
                  admin: {
                    width: '50%',
                    hidden: true, // Added hidden: true
                    description: 'Internal display name (auto-generated)', // Clarified description
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    description: "Professional title (e.g., 'PhD Candidate', 'Professor')",
                  },
                },
              ],
            },
            {
              // New row for first, middle, last names
              type: 'row',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  required: true, // Making first name required for better data quality
                  admin: {
                    width: '33%',
                    description: 'Given Name (for BibTeX/Schema)',
                  },
                },
                {
                  name: 'middleName',
                  type: 'text',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true, // Making last name required for better data quality
                  admin: {
                    width: '33%',
                    description: 'Family Name (for BibTeX/Schema)',
                  },
                },
              ],
            },
            ...slugField('name'),
            {
              name: 'affiliation',
              type: 'relationship',
              relationTo: 'organizations',
              admin: {
                description: 'Primary Affiliation (e.g., University, Company)',
              },
            },
            {
              name: 'affiliationLabel',
              label: 'Custom Affiliation',
              type: 'text',
              admin: {
                description: 'Enter if not in Organizations list, or to override display.',
              },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Headshot or profile image',
              },
            },
            {
              name: 'bio',
              type: 'richText',
              admin: {
                description: 'Short bio or detailed profile',
              },
            },
            {
              name: 'researchInterests',
              type: 'relationship',
              relationTo: 'keywords',
              hasMany: true,
              admin: {
                description:
                  'Select relevant research concepts and interests (e.g., "HCI", "ICTD")',
              },
            },
            {
              name: 'socials',
              label: 'Links',
              type: 'array',
              admin: {
                description: 'Social media and professional links',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Google Scholar', value: 'google-scholar' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Personal Website', value: 'website' },
                        { label: 'X (Twitter)', value: 'x' },
                        { label: 'GitHub', value: 'github' },
                      ],
                      admin: {
                        width: '40%',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '60%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // TAB 2: Contact & Identifiers - Technical/private info
        {
          label: 'Contact & Identifiers',
          description: 'Contact information and academic identifiers',
          fields: [
            {
              name: 'email',
              type: 'email',
              admin: {
                description: 'Contact email (used in schema.org Person markup)',
              },
            },
            {
              name: 'orcid',
              label: 'ORCID',
              type: 'text',
              admin: {
                description: 'ORCID identifier for academic identity',
                placeholder: '0000-0002-1825-0097',
              },
            },
            {
              name: 'openalex_author_id',
              label: 'OpenAlex Author ID',
              type: 'text',
              admin: {
                description: 'OpenAlex author identifier for future sync',
                placeholder: 'A5023888391',
              },
            },
          ],
        },
      ],
    },

    // SIDEBAR FIELDS
    {
      name: 'role',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Director', value: 'director' },
        { label: 'Faculty Member', value: 'faculty' },
        { label: 'Graduate RA', value: 'graduate-ra' },
        { label: 'Undergraduate RA', value: 'undergraduate-ra' },
        { label: 'Alumni', value: 'alumni' },
        { label: 'Interdisciplinary Collaborator', value: 'interdisciplinary-collaborator' },
        { label: 'External Collaborator', value: 'external-collaborator' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'displayInWebsite',
      type: 'checkbox',
      index: true,
      defaultValue: true,
      admin: {
        description: 'Show on website',
        position: 'sidebar',
      },
    },
    {
      name: 'alumniYear',
      type: 'number',
      admin: {
        description: 'Year of departure',
        position: 'sidebar',
        condition: (data) => data?.role === 'alumni',
      },
    },
    {
      name: 'currentPosition',
      type: 'text',
      admin: {
        description: 'Current role/company (e.g., "Software Engineer at Google")',
        position: 'sidebar',
        condition: (data) => data?.role === 'alumni',
      },
    },
    // Join fields - read only
    {
      name: 'projects',
      type: 'join',
      collection: 'projects',
      on: 'teamMembers',
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'publications',
      type: 'join',
      collection: 'publications',
      on: 'authors.teamMember',
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'grants',
      type: 'join',
      collection: 'grants',
      on: 'investigators.teamMember',
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
  ],
  hooks: {
    beforeChange: [populateFullName, setDisplayInTeam, validateTeamMembers], // populateFullName added here
    afterRead: [populateRoleLabel],
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

export default Team
