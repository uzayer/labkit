import { FaqDesignVersion } from './config'
import Faq1 from '@/blocks/Faq/faq1'
import Faq2 from '@/blocks/Faq/faq2'
import Faq3 from '@/blocks/Faq/faq3'
import Faq4 from '@/blocks/Faq/faq4'
import Faq5 from '@/blocks/Faq/faq5'

type Faq<T extends string = string> = Required<Record<FaqDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const faq: Faq = {
  FAQ1: Faq1,
  FAQ2: Faq2,
  FAQ3: Faq3,
  FAQ4: Faq4,
  FAQ5: Faq5,
}

export const FaqBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'faq') return null
  if (!designVersion) return null

  const FaqToRender = faq[designVersion as FaqDesignVersion]

  if (!FaqToRender) return null

  return <FaqToRender {...props} />
}

export default FaqBlock
