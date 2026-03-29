import encryptionHooks from '@/hooks/encryptionHook'
import {
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { variantsToOptions } from '@/blocks/utils'
import { linkGroup } from '@/fields/linkGroup'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'
import { variants } from './variants'

export type ChangelogDesignVersion = keyof typeof variants

export const ChangelogBlock: Block = {
  slug: 'changelog',
  labels: {
    singular: 'Changelog',
    plural: 'Changelogs',
  },
  fields: [
    designVersionPreview(variantsToOptions(variants)),
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'Add a tagline underneath the intro text',
          de: 'Überschrift unterhalb des Intro-Texts hinzu',
        },
      },
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
    },
    {
      name: 'fetchFromGithub',
      label: {
        en: 'Automatically fetch changelog updates from GitHub (this feature is not yet implemented)',
        de: 'Automatisch Changelog-Aktualisierung von GitHub abrufen (diese Funktion ist noch nicht implementiert)',
      },
      type: 'checkbox',
    },
    {
      name: 'githubSettings',
      admin: {
        condition: (_, { fetchFromGithub }) => fetchFromGithub,
      },
      type: 'group',
      fields: [
        {
          name: 'repository',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'company/repo',
            description: 'The repository to fetch the changelog from',
          },
        },
        {
          name: 'githubToken',
          type: 'text',
          admin: {
            description: 'Optional GitHub token to use for authentication',
          },
          hooks: encryptionHooks,
        },
        {
          name: 'Fetch now',
          type: 'ui',
          admin: {
            components: {
              Field: {
                path: '@/components/AdminDashboard/Changelog/FetchButton',
              },
            },
          },
        },
      ],
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_: any, { designVersion = '' }: any = {}) =>
            ['CHANGELOG4', 'CHANGELOG5'].includes(designVersion),
          description: 'Social links (Changelog 4) or subscribe/follow links (Changelog 5)',
        },
      },
    }),
    {
      name: 'entries',
      label: {
        en: 'Changelog entries',
        de: 'Changelog-Einträge',
      },
      admin: {
        description: {
          en: "Add changelog entries. Entries coming from Github won't be overwritten when the data is updated manually.",
          de: 'Changelog-Einträge hinzufügen',
        },
      },
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: {
              en: 'Describe this release. We will auto-generate it using the version, if not set',
            },
          },
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [...rootFeatures, OrderedListFeature(), UnorderedListFeature()]
            },
          }),
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'version',
          type: 'text',
          admin: {
            condition: createBlockItemCondition(['CHANGELOG1', 'CHANGELOG8']),
          },
        },
        {
          name: 'githubId',
          type: 'text',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: {
              en: 'Optional image for the entry',
              de: 'Optionales Bild für den Eintrag',
            },
          },
        },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          admin: {
            description: 'Bullet list items (e.g. "What\'s included")',
            condition: createBlockItemCondition(['CHANGELOG8']),
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'category',
          type: 'text',
          localized: true,
          admin: {
            description: 'Single category label (e.g. "New feature", "Improvement")',
            condition: createBlockItemCondition(['CHANGELOG5']),
          },
        },
        {
          name: 'tags',
          type: 'array',
          labels: { singular: 'Tag', plural: 'Tags' },
          admin: {
            condition: createBlockItemCondition(['CHANGELOG3']),
          },
          fields: [
            {
              name: 'tagName',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'tagColor',
              type: 'select',
              options: [
                { label: 'Green', value: 'green' },
                { label: 'Blue', value: 'blue' },
                { label: 'Purple', value: 'purple' },
                { label: 'Red', value: 'red' },
                { label: 'Yellow', value: 'yellow' },
              ],
              defaultValue: 'blue',
            },
          ],
        },
        {
          name: 'author',
          type: 'text',
          localized: true,
          admin: {
            description: 'Author name',
            condition: createBlockItemCondition(['CHANGELOG5']),
          },
        },
        {
          name: 'authorRole',
          type: 'text',
          localized: true,
          admin: {
            description: 'Author role/title',
            condition: createBlockItemCondition(['CHANGELOG5']),
          },
        },
        {
          name: 'authorImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Author avatar image',
            condition: createBlockItemCondition(['CHANGELOG4', 'CHANGELOG5']),
          },
        },
        {
          name: 'excerpt',
          type: 'text',
          localized: true,
          admin: {
            description: 'Short summary shown in list view; full description shown in dialog',
            condition: createBlockItemCondition(['CHANGELOG6']),
          },
        },
        {
          name: 'contributors',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          admin: {
            description: 'Contributor avatar images',
            condition: createBlockItemCondition(['CHANGELOG6']),
          },
        },
      ],
    },
  ],
  interfaceName: 'changelogblock',
}

export default ChangelogBlock
