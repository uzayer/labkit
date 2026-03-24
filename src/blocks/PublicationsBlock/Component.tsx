import Publications1 from '@/blocks/PublicationsBlock/publications1'
import PublicationsDynamic from '@/blocks/PublicationsBlock/publications-dynamic'

import { PublicationsBlockDesignVersion } from './config'

type Publications<T extends string = string> = Required<
  Record<PublicationsBlockDesignVersion, React.FC<any>>
> &
  Record<T, React.FC<any>>

const publications: Publications = {
  publications1: Publications1,
  'publications-dynamic': PublicationsDynamic,
}

export const PublicationsBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'publicationsBlock') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const PublicationsToRender = publications[designVersion as PublicationsBlockDesignVersion]

  if (!PublicationsToRender) return null

  return <PublicationsToRender {...props} />
}

export default PublicationsBlock
