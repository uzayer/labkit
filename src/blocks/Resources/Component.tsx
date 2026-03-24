import Resources4 from '@/blocks/Resources/resources4'

import { ResourcesDesignVersion } from './config'

type Resources<T extends string = string> = Required<
  Record<ResourcesDesignVersion, React.FC<any>>
> &
  Record<T, React.FC<any>>

const resources: Resources = {
  resources4: Resources4,
}

export const ResourcesBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'resources') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const ResourcesToRender = resources[designVersion as ResourcesDesignVersion]

  if (!ResourcesToRender) return null

  return <ResourcesToRender {...props} />
}

export default ResourcesBlock
