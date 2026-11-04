import { publicationCard } from '@/lib/dial/og/cards'
import { ogImage } from '@/lib/dial/og/og-image'

export { size } from '@/lib/dial/og/og-image'
// Printed from the cached records and cached with them, like the pages: the
// records' cache tag expires it (see the (dial) layout). None at build; each
// renders on its first request.
export const revalidate = 3600
export function generateStaticParams() {
  return []
}
export const contentType = 'image/webp'
export const alt = 'A publication from DIAL'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  return ogImage(await publicationCard((await params).id))
}
