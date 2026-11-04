import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TextLink } from '@/components/site/links'
import { getSite } from '@/lib/site'
import { NEWS_TYPE_LABELS, formatNewsDate } from '@/lib/site/format'
import { label, pageTitle } from '@/lib/site/typography'
import { cn } from '@/utils'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite()
  const item = site.findNews((await params).slug)
  if (!item) return {}
  return { title: item.title, description: item.description.slice(0, 300) }
}

export default async function NewsItemPage({ params }: Props) {
  const site = await getSite()
  // A switched-off Feature loads no News Items, so this 404s along with the list.
  const item = site.findNews((await params).slug)
  if (!item) notFound()
  const photo = site.media(item.photo)

  return (
    <article className="container pt-16 pb-12 md:pt-28 md:pb-16">
      <p className={label}>
        <Link href="/news" className="hover:text-foreground">
          News
        </Link>
        <span aria-hidden> / </span>
        {NEWS_TYPE_LABELS[item.type]}
      </p>
      <h1 className={cn(pageTitle, 'mt-4 max-w-5xl text-4xl md:text-6xl')}>{item.title}</h1>
      <p className="mt-8 border-t border-border pt-6 text-muted-foreground">
        <time dateTime={item.date.slice(0, 10)}>{formatNewsDate(item)}</time>
      </p>
      {photo?.url && (
        <img
          src={photo.url}
          alt={photo.alt ?? ''}
          width={photo.width ?? undefined}
          height={photo.height ?? undefined}
          className="mt-8 w-full max-w-3xl rounded-md"
        />
      )}
      <p className="mt-8 max-w-prose text-lg leading-relaxed text-pretty whitespace-pre-line">
        {item.description}
      </p>
      {item.url && (
        <TextLink href={item.url} className="mt-8">
          More about this
        </TextLink>
      )}
    </article>
  )
}
