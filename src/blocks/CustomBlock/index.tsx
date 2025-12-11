// Import your custom blocks here
// import ExampleBlock from './example'

import { PublicContextProps } from '@/utilities/publicContextProps'
import type { CustomBlock as CustomBlockType } from '@/payload-types'
import TeamDial from './team-dial'

const customBlockComponents: Record<string, React.FC<any>> = {
  'team-dial': TeamDial,
}

export const CustomBlock: React.FC<
  CustomBlockType & { publicContext: PublicContextProps; disableContainer?: boolean }
> = (props) => {
  const { customBlockType } = props
  if (!customBlockType) return null

  const BlockComponent = customBlockComponents[customBlockType]

  if (!BlockComponent) return null

  return <BlockComponent {...props} />
}

export default CustomBlock
