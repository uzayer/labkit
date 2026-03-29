import { WishlistDesignVersion } from './config'
import Wishlist1 from '@/blocks/Wishlist/wishlist1'
import Wishlist2 from '@/blocks/Wishlist/wishlist2'

type Wishlist<T extends string = string> = Required<Record<WishlistDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const wishlist: Wishlist = {
  WISHLIST1: Wishlist1,
  WISHLIST2: Wishlist2,
}

export const WishlistBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'wishlist') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const WishlistToRender = wishlist[designVersion as WishlistDesignVersion]

  if (!WishlistToRender) return null

  return <WishlistToRender {...props} />
}

export default WishlistBlock
