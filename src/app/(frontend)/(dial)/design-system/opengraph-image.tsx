import { designSystemCard } from '@/lib/dial/og/cards'
import { ogImage } from '@/lib/dial/og/og-image'

export { size } from '@/lib/dial/og/og-image'
export const contentType = 'image/webp'
export const alt = 'DIAL design system and guidelines'

export default function Image() {
  return ogImage(designSystemCard())
}
