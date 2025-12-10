import { BannerBlock } from '@/blocks/LexicalBlocks/Banner/Component'
import { MotionTextBlock } from '@/blocks/LexicalBlocks/MotionText/Component'
import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import React, { Fragment, JSX } from 'react'
import { CMSLink } from '@/components/Link'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type {
  BannerBlock as BannerBlockProps,
  MotionTextBlock as MotionTextBlockProps,
  Media as MediaType,
} from '@/payload-types'
import Image from 'next/image'

import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'
import type { Page } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { getHeadlineId } from '@/utilities/richtext'

// Define types locally since they're not exported from the main package

type StateValues = {
  [stateValue: string]: {
    css: React.CSSProperties

    label: string
  }
}

type TextStateFeatureProps = {
  state: {
    [stateKey: string]: StateValues
  }
}

// Local copy of defaultColors to avoid Node.js import issues
const defaultColors = {
  text: {
    'text-red': {
      css: {
        color: 'light-dark(oklch(0.577 0.245 27.325), oklch(0.704 0.191 22.216))',
      },

      label: 'Red',
    },

    'text-orange': {
      css: {
        color: 'light-dark(oklch(0.646 0.222 41.116), oklch(0.75 0.183 55.934))',
      },

      label: 'Orange',
    },

    'text-yellow': {
      css: {
        color: 'light-dark(oklch(0.554 0.135 66.442), oklch(0.897 0.196 126.665))',
      },

      label: 'Yellow',
    },

    'text-green': {
      css: {
        color: 'light-dark(oklch(0.527 0.154 150.069), oklch(0.792 0.209 151.711))',
      },

      label: 'Green',
    },

    'text-blue': {
      css: {
        color: 'light-dark(oklch(0.546 0.245 262.881), oklch(0.707 0.165 254.624))',
      },

      label: 'Blue',
    },

    'text-purple': {
      css: {
        color: 'light-dark(oklch(0.558 0.288 302.321), oklch(0.714 0.203 305.504))',
      },

      label: 'Purple',
    },

    'text-pink': {
      css: {
        color: 'light-dark(oklch(0.592 0.249 0.584), oklch(0.718 0.202 349.761))',
      },

      label: 'Pink',
    },
  },
}

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | Extract<Page['layout'][0], { blockType: 'cta' }>
      | Extract<Page['layout'][0], { blockType: 'mediaBlock' }>
      | BannerBlockProps
      | MotionTextBlockProps
      | CodeBlockProps
    >

export type OverrideStyle = Partial<
  Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'li', string>
>

type Props = {
  nodes: NodeTypes[]
  overrideStyle?: OverrideStyle
}

const colorState: TextStateFeatureProps['state'] = {
  color: {
    ...defaultColors.text,

    'text-grey': {
      label: 'Grey',

      css: {
        color: 'hsl(0, 0%, 41%)',
      },
    },
  },
}

type ExtractAllColorKeys<T> = {
  [K in keyof T]: T[K] extends StateValues ? keyof T[K] : never
}[keyof T]

type ColorStateKeys = ExtractAllColorKeys<typeof colorState>

export function serializeLexical({
  nodes,
  overrideStyle,
  publicContext,
}: Props & { publicContext: PublicContextProps }): JSX.Element {
  const defaultStyles: OverrideStyle = {
    h1: 'mb-4 text-4xl font-semibold md:text-5xl',
    h2: 'mb-4 text-3xl font-semibold',
    h3: 'mb-3 text-2xl font-semibold',
    h4: 'mb-2 text-xl font-semibold',
    p: 'text-lg mb-3',
    li: 'text-lg',
  }

  const mergedStyles = { ...defaultStyles, ...overrideStyle }

  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node == null) {
          return null
        }
        if (node.type === 'text') {
          const styles: React.CSSProperties = {}

          if (node.$) {
            Object.entries(colorState).forEach(([stateKey, stateValues]) => {
              const stateValue = node.$ && (node.$[stateKey] as ColorStateKeys)

              if (stateValue && stateValues[stateValue]) {
                Object.assign(styles, stateValues[stateValue].css)
              }
            })
          }
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>
          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_CODE) {
            text = <code key={index}>{node.text}</code>
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }
          // Handle TextStateFeature styling for color
          if (node.$) {
            text = (
              <span key={index} style={styles}>
                {text}
              </span>
            )
          }

          return text
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: NodeTypes): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
            }
            return serializeLexical({
              nodes: node.children as NodeTypes[],
              overrideStyle: mergedStyles,
              publicContext,
            })
          }
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : ''

        if (node.type === 'block') {
          const block = node.fields

          const blockType = block?.blockType

          if (!block || !blockType) {
            return null
          }

          switch (blockType) {
            // case 'cta':
            //   return <CallToActionBlock key={index} {...block} />
            case 'mediaBlock':
              return (
                <MediaBlock
                  disableContainer
                  key={index}
                  {...block}
                  captionClassName="mx-auto max-w-3xl"
                />
              )
            case 'banner':
              return (
                <BannerBlock
                  className="col-start-2 mb-4"
                  key={index}
                  {...block}
                  publicContext={publicContext}
                />
              )
            case 'code':
              return <CodeBlock className="col-start-2" key={index} {...block} />
            case 'motionText':
              return (
                <MotionTextBlock
                  key={index}
                  {...block}
                  className="col-start-2"
                  publicContext={publicContext}
                  overrideStyles={mergedStyles}
                />
              )
            default:
              return null
          }
        } else {
          switch (node.type) {
            case 'linebreak': {
              return <br className="col-start-2" key={index} />
            }
            case 'paragraph': {
              let className = 'col-start-2'
              if (mergedStyles?.p) {
                className = cn(className, mergedStyles?.p)
              }
              if (node.format === 'center') {
                className = cn(className, 'text-center')
              } else if (node.format === 'right') {
                className = cn(className, 'text-right')
              }
              // Handle empty paragraphs for newlines
              const children =
                node.children && node.children.length > 0 ? serializedChildrenFn(node) : <br />

              return (
                <p className={className} key={index}>
                  {children}
                </p>
              )
            }
            case 'heading': {
              const Tag = node?.tag
              let className = 'col-start-2'
              if (mergedStyles?.[Tag]) {
                className = cn(className, mergedStyles?.[Tag])
              }
              if (node.format === 'center') {
                className = cn(className, 'text-center')
              } else if (node.format === 'right') {
                className = cn(className, 'text-right')
              }
              return (
                /**
                 * Set a unique headline id for side menu navigation and general anchor links
                 */
                <Tag className={className} key={index} id={getHeadlineId(node, index.toString())}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'list': {
              const Tag = node?.tag
              return (
                <Tag
                  className={cn(
                    'col-start-2 mt-4 mb-2 space-y-3 ps-7',
                    // Add specific styling based on list type
                    node.listType === 'bullet' ? 'list-disc' : 'list-decimal',
                  )}
                  key={index}
                >
                  {serializedChildren}
                </Tag>
              )
            }
            case 'listitem': {
              let className = ''
              if (mergedStyles?.li) {
                className = cn(className, mergedStyles?.li)
              }
              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? 'true' : 'false'}
                    className={className}
                    key={index}
                     
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    {serializedChildren}
                  </li>
                )
              } else {
                return (
                  <li key={index} className={className} value={node?.value}>
                    {serializedChildren}
                  </li>
                )
              }
            }
            case 'quote': {
              return (
                <blockquote className="col-start-2" key={index}>
                  {serializedChildren}
                </blockquote>
              )
            }
            case 'link': {
              const fields = node.fields

              return (
                <CMSLink
                  publicContext={publicContext}
                  key={index}
                  newTab={Boolean(fields?.newTab)}
                  reference={fields.doc as any}
                  type={fields.linkType === 'internal' ? 'reference' : 'custom'}
                  url={fields.url}
                  appearance="inline"
                  className="text-muted-foreground transition-colors hover:underline"
                >
                  {serializedChildren}
                </CMSLink>
              )
            }

            case 'upload': {
              const media = node.value as MediaType

              if (!media) return null

              const { filename, width, height, alt } = media
              const url = media.url || `/media/${filename}`

              return (
                <div className="col-start-2 my-4" key={index}>
                  <figure className="relative w-full">
                    <Image
                      src={url}
                      alt={alt || ''}
                      width={width || 800}
                      height={height || 600}
                      className="h-auto w-full rounded-md"
                    />
                    {media.caption && (
                      <figcaption className="text-muted-foreground mt-2 text-sm">
                        {typeof media.caption === 'string'
                          ? media.caption
                          : serializeLexical({
                              nodes: media.caption as any,
                              overrideStyle: {
                                p: 'text-sm text-muted-foreground mt-0 mb-0',
                              },
                              publicContext,
                            })}
                      </figcaption>
                    )}
                  </figure>
                </div>
              )
            }

            default:
              return null
          }
        }
      })}
    </Fragment>
  )
}
