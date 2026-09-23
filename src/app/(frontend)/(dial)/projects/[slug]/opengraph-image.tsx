import { projectCard } from '@/lib/dial/og/cards'
import { ogImage } from '@/lib/dial/og/og-image'

export { size } from '@/lib/dial/og/og-image'
// Printed from live records, so never prerendered at build time.
export const dynamic = 'force-dynamic'
export const contentType = 'image/webp'
export const alt = 'A project from DIAL'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return ogImage(await projectCard((await params).slug))
}
