import { backgroundColor } from '@/fields/color'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block, Field } from 'payload'

const PROJECT_POST_CASE_STUDY_SLUG = 'projectpost-casestudy3'
const TEAM_DIAL_SLUG = 'team-dial'

const caseStudy3Fields: Field[] = [
  {
    name: 'heroImage',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Primary illustration displayed beside the intro content',
    },
  },
  {
    name: 'overview',
    type: 'textarea',
    admin: {
      description: 'Short overview copy shown in the sidebar',
      placeholder:
        'Describe the company or initiative this case study covers (e.g. “A modern platform…”)',
    },
  },
  {
    name: 'metaItems',
    type: 'array',
    label: 'Sidebar Metadata',
    labels: {
      singular: 'Meta item',
      plural: 'Meta items',
    },
    admin: {
      description: 'Add sidebar metadata such as Sector, Team size, Location, Funding, etc.',
    },
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'value',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    name: 'problem',
    type: 'textarea',
    label: 'Problem Statement',
    admin: {
      placeholder: 'Describe the challenge or friction this case study addresses',
    },
  },
  {
    name: 'approach',
    type: 'textarea',
    label: 'Approach Description',
    admin: {
      placeholder: 'Explain the solution, methodology, or strategy that was applied',
    },
  },
  {
    name: 'outcomes',
    type: 'array',
    labels: {
      singular: 'Outcome',
      plural: 'Outcomes',
    },
    admin: {
      description: 'List impact statements or results (e.g. “Accelerated growth initiatives”).',
    },
    fields: [
      {
        name: 'headline',
        type: 'text',
        required: true,
        label: 'Outcome',
      },
    ],
  },
  {
    name: 'shareLabel',
    type: 'text',
    label: 'Share Label',
    admin: {
      placeholder: 'Share this content:',
    },
  },
]

/**
 * We define here just additional config fields for the custom blocks
 */
export const CustomBlock: Block = {
  slug: 'customblock', // This will be the base slug for all custom blocks
  interfaceName: 'CustomBlock',
  labels: {
    singular: 'Custom Block',
    plural: 'Custom Blocks',
  },
  fields: [
    backgroundColor,
    {
      name: 'customBlockType', // Changed from blockType to avoid conflict
      type: 'select',
      required: true,
      options: [
        {
          label: 'Project Post – Case Study 3',
          value: PROJECT_POST_CASE_STUDY_SLUG,
        },
        {
          label: 'Team DIAL',
          value: TEAM_DIAL_SLUG,
        },
      ],
    },
    {
      name: 'projectPostCaseStudy3',
      type: 'group',
      label: 'Project Case Study 3 Settings',
      admin: {
        condition: (_, { customBlockType } = {}) =>
          customBlockType === PROJECT_POST_CASE_STUDY_SLUG,
      },
      fields: caseStudy3Fields,
    },
    {
      name: 'teamDial',
      type: 'group',
      label: 'Team DIAL Settings',
      admin: {
        condition: (_, { customBlockType } = {}) => customBlockType === TEAM_DIAL_SLUG,
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'Team',
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            ],
          }),
        },
        {
          name: 'rolesToDisplay',
          type: 'select',
          hasMany: true,
          required: true,
          options: [
            {
              label: 'Director',
              value: 'director',
            },
            {
              label: 'Faculty Member',
              value: 'faculty',
            },
            {
              label: 'Graduate RA',
              value: 'graduate-ra',
            },
            {
              label: 'Undergraduate RA',
              value: 'undergraduate-ra',
            },
            {
              label: 'Alumni',
              value: 'alumni',
            },
            {
              label: 'Interdisciplinary Collaborator',
              value: 'interdisciplinary-collaborator',
            },
            {
              label: 'External Collaborator',
              value: 'external-collaborator',
            },
          ],
          admin: {
            description: 'Select which roles to display as filter tabs',
          },
        },
      ],
    },
  ],
}
