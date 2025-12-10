import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'An open-source website built with Payload and Next.js.',
  siteName: 'Payload Website Template',
  title: 'Payload Website Template',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  const mergedOG = { ...defaultOpenGraph, ...og }
  // Prevent setting images: undefined, as this would prevent next.js from setting the automatically generated image url
  if (!mergedOG.images) {
    delete mergedOG.images
  }
  return mergedOG
}
