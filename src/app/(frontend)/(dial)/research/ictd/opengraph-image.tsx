import { themeCard } from '@/lib/dial/og/cards'
import { ogImage } from '@/lib/dial/og/og-image'

export { size } from '@/lib/dial/og/og-image'
// Printed from live records, so never prerendered at build time.
export const dynamic = 'force-dynamic'
export const contentType = 'image/webp'
export const alt = 'A DIAL Research Theme'

export default async function Image() {
  return ogImage(await themeCard('ictd'))
}
