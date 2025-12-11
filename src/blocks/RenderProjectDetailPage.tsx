import { Project } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { ProjectPostBlock } from './ProjectPost/Component'

export const RenderProjectDetailPage: React.FC<{
  project: Project
  publicContext: PublicContextProps
  disableContainer?: boolean
}> = (props) => {
  return <ProjectPostBlock {...props.project} publicContext={props.publicContext} />
}
