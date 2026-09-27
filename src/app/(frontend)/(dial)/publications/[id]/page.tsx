import { notFound } from 'next/navigation'

import { PublicationPost } from '@/components/dial/publication-post'
import { getDial } from '@/lib/dial/data/get'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { getPublication, citationsFor } = await getDial()
  const { id } = await params
  const pub = getPublication(id)
  if (!pub) return {}
  return {
    title: pub.title,
    // The abstract is the paper's own summary; nothing is written for SEO.
    // Without one, the reference itself says who, where, and when.
    description: pub.abstract ?? citationsFor(pub).acm,
  }
}

export default async function PublicationDetailPage({ params }: Props) {
  const { getPublication, toPublicationPost } = await getDial()
  const { id } = await params
  const pub = getPublication(id)
  if (!pub) notFound()
  return <PublicationPost pub={toPublicationPost(pub)} />
}
