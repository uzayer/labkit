import { CareersDesignVersion } from './config'
import Careers3 from '@/blocks/Careers/careers3'

type Careers<T extends string = string> = Required<Record<CareersDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const careers: Careers = {
  CAREERS3: Careers3,
}

export const CareersBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'careers') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const CareersToRender = careers[designVersion as CareersDesignVersion]

  if (!CareersToRender) return null

  return <CareersToRender {...props} />
}

export default CareersBlock
