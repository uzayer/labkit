import { Block } from 'payload'
import {
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { FormBlock } from '../Form/config'
import { backgroundColor } from '@/fields/color'
import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'

export const allContactDesignVersions = [
  { label: 'CONTACT1', value: 'CONTACT1', image: '/admin/previews/contact/contact1.webp' },
  { label: 'CONTACT2', value: 'CONTACT2', image: '/admin/previews/contact/contact2.webp' },
  { label: 'CONTACT3', value: 'CONTACT3', image: '/admin/previews/contact/contact3.webp' },
  { label: 'CONTACT4', value: 'CONTACT4', image: '/admin/previews/contact/contact4.webp' },
  // { label: 'CONTACT5', value: 'CONTACT5', image: '/admin/previews/contact/contact5.webp' },
  // { label: 'CONTACT6', value: 'CONTACT6', image: '/admin/previews/contact/contact6.webp' },
  // { label: 'CONTACT7', value: 'CONTACT7', image: '/admin/previews/contact/contact7.webp' },
  // { label: 'CONTACT8', value: 'CONTACT8', image: '/admin/previews/contact/contact8.webp' },
  // { label: 'CONTACT9', value: 'CONTACT9', image: '/admin/previews/contact/contact9.webp' },
  // { label: 'CONTACT10', value: 'CONTACT10', image: '/admin/previews/contact/contact10.webp' },
  // { label: 'CONTACT11', value: 'CONTACT11', image: '/admin/previews/contact/contact11.webp' },
  // { label: 'CONTACT14', value: 'CONTACT14', image: '/admin/previews/contact/contact14.webp' },
  // { label: 'CONTACT16', value: 'CONTACT16', image: '/admin/previews/contact/contact16.webp' },
  // { label: 'CONTACT17', value: 'CONTACT17', image: '/admin/previews/contact/contact17.webp' },
  // { label: 'CONTACT18', value: 'CONTACT18', image: '/admin/previews/contact/contact18.webp' },
  // { label: 'CONTACT19', value: 'CONTACT19', image: '/admin/previews/contact/contact19.webp' },
  // { label: 'CONTACT20', value: 'CONTACT20', image: '/admin/previews/contact/contact20.webp' },
] as const
export type ContactDesignVersion = (typeof allContactDesignVersions)[number]['value']

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact',
    plural: 'Contacts',
  },
  fields: [
    backgroundColor,
    designVersionPreview(allContactDesignVersions),
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          InlineToolbarFeature(),
          ParagraphFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
        ],
      }),
    },
    {
      name: 'contactBlocks',
      type: 'array',
      fields: [
        icon(),
        {
          name: 'description',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => rootFeatures,
          }),
        },
      ],
    },
    {
      name: 'maps',
      type: 'array',
      fields: [
        {
          name: 'iframe',
          type: 'text',
        },
      ],
    },
    {
      name: 'form',
      label: 'Form',
      type: 'blocks',
      blocks: [FormBlock],
      maxRows: 1,
    },
  ],
}
