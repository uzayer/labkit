import { Post } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { BlogPostBlock } from './BlogPost/Component'

export const RenderPostDetailPage: React.FC<{
  post: Post
  publicContext: PublicContextProps
  disableContainer?: boolean
}> = (props) => {
  return <BlogPostBlock {...props.post} publicContext={props.publicContext} />
}
