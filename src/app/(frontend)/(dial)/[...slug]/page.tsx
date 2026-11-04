import { PayloadRedirects } from '@/components/PayloadRedirects'

// Per request: arbitrary URLs land here, and caching each one would fill the
// page cache with 404s.
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string[] }> }

/**
 * Any path no DIAL route claims: follow a Payload redirect when one matches
 * (old-site URLs, once DIAL's address moves over), otherwise DIAL's 404.
 */
export default async function UnmatchedPage({ params }: Props) {
  const { slug } = await params
  return <PayloadRedirects url={`/${slug.join('/')}`} />
}
