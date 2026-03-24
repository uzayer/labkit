import type { DefaultNodeTypes, SerializedHeadingNode } from '@payloadcms/richtext-lexical'

export type RichTextNode<T = DefaultNodeTypes> = {
  type?: string
  tag?: string
  children?: RichTextNode<T>[]
  [key: string]: any
} & T

export type RichTextContent<T = DefaultNodeTypes> = {
  root?: {
    children?: RichTextNode<T>[]
    [key: string]: any
  }
  [key: string]: any
}

type SplitOptions = {
  splitOn?: string[] | string // e.g., ['heading', 'h1', 'h2'] or 'heading'
  takeFirst?: boolean // if true, takes first matching node, if false takes first node regardless of type
}

/**
 * Splits a RichText content object into two parts: the first matching node and the rest.
 * Useful for layouts where you need to render part of the rich text content differently,
 * such as displaying a heading next to an icon and the remaining content below.
 *
 * @template T - The type of the RichText content, must have a root object with children array
 * @param content - The RichText content to split
 * @param options - Configuration options for splitting
 * @param options.splitOn - String or array of strings to match against node type or tag
 * @param options.takeFirst - If true, takes first matching node from splitOn, if false takes first node regardless
 * @returns Object containing firstNode and rest, both preserving the original content type
 *
 * @example
 * // Split on first node (default behavior)
 * const { firstNode, rest } = splitRichText(richTextContent);
 *
 * @example
 * // Split on first heading (h1, h2, h3)
 * const { firstNode, rest } = splitRichText(richTextContent, {
 *   splitOn: ['h1', 'h2', 'h3'],
 *   takeFirst: true
 * });
 *
 * @example
 * // Usage in a component
 * function MyComponent({ content }) {
 *   const { firstNode, rest } = splitRichText(content, {
 *     splitOn: ['h1', 'h2'],
 *     takeFirst: true
 *   });
 *
 *   return (
 *     <div>
 *       <div className="header">
 *         <Icon />
 *         <RichText publicContext={publicContext} content={firstNode} />
 *       </div>
 *       <div className="content">
 *         <RichText publicContext={publicContext} content={rest} />
 *       </div>
 *     </div>
 *   );
 * }
 */
export const splitRichText = <T extends { root?: { children?: any[] } }>(
  content: T | null | undefined,
  options: SplitOptions = {},
): {
  firstNode: T | null
  rest: T | null
} => {
  if (!content?.root?.children?.length) {
    return { firstNode: null, rest: null }
  }

  const { splitOn = [], takeFirst = false } = options
  const children = content.root.children
  const splitTypes = Array.isArray(splitOn) ? splitOn : [splitOn]

  let splitIndex = 0
  if (takeFirst && splitTypes.length > 0) {
    // Find the first node that matches any of the split types
    splitIndex = children.findIndex(
      (node) =>
        (node.type && splitTypes.includes(node.type)) ||
        (node.tag && splitTypes.includes(node.tag)),
    )
    if (splitIndex === -1) splitIndex = 0
  }

  const firstNodeContent = children[splitIndex]
  const restNodes = children.slice(splitIndex + 1)

  return {
    firstNode: firstNodeContent
      ? { ...content, root: { ...content.root, children: [firstNodeContent] } }
      : null,
    rest: restNodes.length ? { ...content, root: { ...content.root, children: restNodes } } : null,
  }
}

/**
 * Extracts text content from a node and its children recursively
 */
const extractTextContent = (node: any): string => {
  if (!node) return ''

  // If it's a text node, return its text content
  if (node.type === 'text') {
    return node.text || ''
  }

  // If it has children, recursively extract text from them
  if (node.children && node.children.length > 0) {
    return node.children.map(extractTextContent).join('')
  }

  return ''
}

/**
 * Generates a consistent id for a headline based on the text content of the node
 * Allows to use an additional index to handle duplicates.
 */
export const getHeadlineId = (node: SerializedHeadingNode, additionalIndex?: string): string => {
  // Extract all text from the heading node and its children
  const text = extractTextContent(node)

  // Create slug in a consistent way
  return `text-${text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}${additionalIndex ? `-${additionalIndex}` : ''}`
}

/**
 * Interface for the menu item returned by getSideMenuStructure
 */
export interface SideMenuItem {
  id: string
  text: string
  level: string
}

/**
 * Take a regular rich text content and generates the side menu with headline class, text and anchor id.
 * Allows filtering for certain headline levels.
 *
 * @param content - The rich text content to generate the side menu from
 * @param options - Configuration options for the side menu
 * @param options.headlineLevels - Array of headline levels to include in the side menu
 * @returns An array of objects containing the headline class, text and anchor id
 */
export const getSideMenuStructure = (
  content: any,
  options?: { headlineLevels?: ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')[] },
): SideMenuItem[] => {
  // Handle the case where options is undefined
  const headlineLevels = options?.headlineLevels ?? ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  if (!content?.root?.children?.length) {
    return []
  }

  const children = content.root.children
  const menuItems: SideMenuItem[] = []

  // Function to recursively search for heading nodes
  const processNodes = (nodes: any[]): void => {
    nodes.forEach((node, index) => {
      if (node.type === 'heading' && headlineLevels.includes(node.tag)) {
        menuItems.push({
          id: getHeadlineId(node, index.toString()),
          text: extractTextContent(node),
          level: node.tag,
        })
      }

      // Process child nodes if they exist
      if (node.children && node.children.length > 0) {
        processNodes(node.children)
      }
    })
  }

  processNodes(children)
  return menuItems
}

/**
 * Extract plain text from rich text content
 */
export function extractPlainText(content: any, maxLength: number = 200): string {
  if (!content || !content.root || !content.root.children) return ''

  let text = ''
  const traverse = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.type === 'text' && typeof node.text === 'string') {
        text += node.text
      } else if (node.children && Array.isArray(node.children)) {
        traverse(node.children)
      }
    }
  }

  try {
    traverse(content.root.children)
  } catch (error) {
    console.error('Error parsing rich text content:', error)
    return ''
  }

  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
