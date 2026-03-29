import { TrustStripDesignVersion } from './config'
import TrustStrip1 from '@/blocks/TrustStrip/trust-strip1'

type TrustStrip<T extends string = string> = Required<
  Record<TrustStripDesignVersion, React.FC<any>>
> &
  Record<T, React.FC<any>>

const trustStrip: TrustStrip = {
  TRUSTSTRIP1: TrustStrip1,
}

export const TrustStripBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'trust-strip') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const TrustStripToRender = trustStrip[designVersion as TrustStripDesignVersion]

  if (!TrustStripToRender) return null

  return <TrustStripToRender {...props} />
}

export default TrustStripBlock
