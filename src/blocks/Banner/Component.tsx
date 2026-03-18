import { BannerDesignVersion } from './config'
import Banner5 from './banner5'
import Banner1 from './banner1'

type Banner<T extends string = string> = Required<Record<BannerDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const banner: Banner = {
  BANNER1: Banner1,
  BANNER5: Banner5,
}

export const BannerBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'banner') return null
  if (!designVersion) return null

  const BannerToRender = banner[designVersion as BannerDesignVersion]

  if (!BannerToRender) return null

  return <BannerToRender {...props} />
}

export default BannerBlock
