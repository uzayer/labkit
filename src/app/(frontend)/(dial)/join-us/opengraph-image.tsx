import { joinCard } from '@/lib/dial/og/cards'
import { ogImage } from '@/lib/dial/og/og-image'

export { size } from '@/lib/dial/og/og-image'
export const contentType = 'image/webp'
export const alt = 'Join DIAL'

export default function Image() {
  return ogImage(joinCard())
}
