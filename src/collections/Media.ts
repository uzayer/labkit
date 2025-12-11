import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description:
          'Alternative text for accessibility. For avatar images, describe the person (e.g., "Jane Smith headshot").',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    // Allow image uploads and PDF files
    mimeTypes: ['image/*', 'application/pdf'],
    // Explicitly enable focal point selector
    focalPoint: true,
    // Generate WebP variants for all images and use a WebP thumbnail in admin
    formatOptions: {
      format: 'webp',
      options: { quality: 80 },
    },
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 320,
      },
      {
        name: 'avatar',
        width: 400,
        height: 400,
        fit: 'cover',
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
      },
    ],
  },
}
