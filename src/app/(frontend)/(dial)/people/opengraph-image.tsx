import { peopleCard } from '@/lib/dial/og/cards'
import { ogImage } from '@/lib/dial/og/og-image'

export { size } from '@/lib/dial/og/og-image'
// Printed from the cached records and cached with them, like the pages: the
// records' cache tag expires it (see the (dial) layout).
export const revalidate = 3600
export const contentType = 'image/webp'
export const alt = 'The people of DIAL'

export default async function Image() {
  return ogImage(await peopleCard())
}
