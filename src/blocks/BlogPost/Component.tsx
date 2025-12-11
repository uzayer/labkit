import { Post } from '@/payload-types'
import { allPostDesignVersions } from '@/collections/Posts/index'
import { BlogPost5 } from './blogpost5'
import { BlogPost4 } from './blogpost4'
import { CaseStudy3 } from '@/blocks/CaseStudy/casestudy3'
import { PublicContextProps } from '@/utilities/publicContextProps'

// Extract just the value property from the design versions for use as keys
type PostDesignVersionValue = (typeof allPostDesignVersions)[number]['value']

// Enforce required blogpost but allow additional ones
type BlogPost<T extends string = string> = Required<Record<PostDesignVersionValue, React.FC<any>>> &
  Record<T, React.FC<any>>

const blogpost: BlogPost<PostDesignVersionValue> = {
  BLOGPOST4: BlogPost4,
  BLOGPOST5: BlogPost5,
  CASESTUDY3: CaseStudy3,
}

/**
 * BlogPost is the Blog Detail Page.
 * @param props
 * @returns
 */
export const BlogPostBlock: React.FC<Post & { publicContext: PublicContextProps }> = (props) => {
  if (!props.content) return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const BlogPostToRender = blogpost[designVersion]

  if (!BlogPostToRender) return null

  return <BlogPostToRender {...props} />
}
