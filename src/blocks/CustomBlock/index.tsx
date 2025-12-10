// Import your custom blocks here
// import ExampleBlock from './example'

import { PublicContextProps } from '@/utilities/publicContextProps'
import type { CustomBlock as CustomBlockType } from '@/payload-types'

export const CustomBlock: React.FC<CustomBlockType & { publicContext: PublicContextProps }> = (
  props,
) => {
  const { customBlockType, publicContext } = props
  // Add your custom blocks here
  // example: ExampleBlock,

  return null
}

export default CustomBlock
