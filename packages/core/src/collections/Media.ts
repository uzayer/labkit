import type { SharpCollectionConfig } from '@payloadcms/transformer-sharp'
import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'

import { anyone } from '../access/anyone'
import { hasPermission } from '../utilities/checkPermission'

const webp = { format: 'webp', options: { quality: 80 } } as const

// Sharp settings live on the transformer (added in plugin.ts), not on the collection.
// Store the original as WebP. Each variant needs its own formatOptions: the
// top-level setting only applies to the original.
export const mediaSharpConfig: SharpCollectionConfig = {
  formatOptions: webp,
  variants: [
    {
      name: 'thumbnail',
      formatOptions: webp,
      width: 320,
      height: 320,
    },
    {
      name: 'avatar',
      formatOptions: webp,
      width: 400,
      height: 400,
      fit: 'cover',
      position: 'centre',
    },
    {
      name: 'card',
      formatOptions: webp,
      width: 800,
    },
    {
      name: 'og',
      formatOptions: webp,
      width: 1200,
      height: 630,
    },
  ],
}

/**
 * `staticDir` is where uploads go when no storage adapter (Blob) handles them.
 * The site passes it, anchored to its own source, because core's location
 * says nothing about where the site's `public/` is.
 */
export const createMedia = ({
  staticDir = path.resolve(process.cwd(), 'public/media'),
}: { staticDir?: string } = {}): CollectionConfig => ({
  slug: 'media',
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: anyone,
    update: hasPermission('canManageContent'),
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
    // Upload to the site's public/media directory, making them publicly accessible even outside of Payload
    staticDir,
    // Allow image uploads and PDF files. SVG is for partner logos: Payload rejects
    // SVGs with scripts or other active content on upload, and never resizes or
    // converts them, so an SVG keeps its vector original and gets no size variants.
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ],
    // Explicitly enable focal point selector
    focalPoint: true,
    adminThumbnail: 'thumbnail',
  },
  versions: false,
  authorship: false,
})
