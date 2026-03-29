import { IndustriesDesignVersion } from './config'
import Industries1 from '@/blocks/Industries/industries1'

type Industries<T extends string = string> = Required<
  Record<IndustriesDesignVersion, React.FC<any>>
> &
  Record<T, React.FC<any>>

const industries: Industries = {
  INDUSTRIES1: Industries1,
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
