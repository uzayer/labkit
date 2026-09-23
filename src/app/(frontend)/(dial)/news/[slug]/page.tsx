import { notFound } from 'next/navigation'

import { NewsPost } from '@/components/dial/news-post'
import { getDial } from '@/lib/dial/data/get'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { toNewsPost } = await getDial()
  const { slug } = await params
  const post = toNewsPost(slug)
  return post ? { title: post.entry.title, description: post.entry.description } : {}
}

export default async function NewsEntryPage({ params }: Props) {
  const { toNewsPost } = await getDial()
  const { slug } = await params
  const post = toNewsPost(slug)
  if (!post) notFound()
  return <NewsPost {...post} />
}
