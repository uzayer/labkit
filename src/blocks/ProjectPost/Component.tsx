import { Project } from '@/payload-types'
import { ProjectPost1 } from './ProjectPost1'
import { PublicContextProps } from '@/utilities/publicContextProps'

const PROJECT_POST_1 = 'ProjectPost1' as const

type ProjectDesignVersionValue = typeof PROJECT_POST_1

// Enforce required project post but allow additional ones
type ProjectPost<T extends string = string> = Required<
  Record<ProjectDesignVersionValue, React.FC<any>>
> &
  Record<T, React.FC<any>>

const projectTemplates: ProjectPost<ProjectDesignVersionValue> = {
  [PROJECT_POST_1]: ProjectPost1,
}

/**
 * ProjectPostBlock is the Project Detail Page Router.
 * @param props
 * @returns
 */
export const ProjectPostBlock: React.FC<Project & { publicContext: PublicContextProps }> = (
  props,
) => {
  if (!props.content) return null

  const { designVersion } = props || {}

  // Fallback to ProjectPost1 if designVersion is missing or not found in map
  const TemplateToRender =
    (designVersion && projectTemplates[designVersion]) || projectTemplates[PROJECT_POST_1]

  if (!TemplateToRender) return null

  return <TemplateToRender {...props} />
}
