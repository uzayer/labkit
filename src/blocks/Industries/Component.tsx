import { IndustriesDesignVersion } from './config'
import Industries1 from '@/blocks/Industries/industries1'
import Industries2 from '@/blocks/Industries/industries2'
import Industries3 from '@/blocks/Industries/industries3'
import Industries4 from '@/blocks/Industries/industries4'

type Industries<T extends string = string> = Required<
  Record<IndustriesDesignVersion, React.FC<any>>
> &
  Record<T, React.FC<any>>

const industries: Industries = {
  INDUSTRIES1: Industries1,
  INDUSTRIES2: Industries2,
  INDUSTRIES3: Industries3,
  INDUSTRIES4: Industries4,
}

export const IndustriesBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'industries') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const IndustriesToRender = industries[designVersion as IndustriesDesignVersion]

  if (!IndustriesToRender) return null

  return <IndustriesToRender {...props} />
}

export default IndustriesBlock
