import Projects17 from '@/blocks/Projects/projects17'
import Projects17b from '@/blocks/Projects/projects17b'

import { ProjectsDesignVersion } from './config'

type Projects<T extends string = string> = Required<Record<ProjectsDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const projects: Projects = {
  '17': Projects17,
  '17b': Projects17b,
}

export const ProjectsBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'projects') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const ProjectsToRender = projects[designVersion as ProjectsDesignVersion]

  if (!ProjectsToRender) return null

  return <ProjectsToRender {...props} />
}

export default ProjectsBlock
