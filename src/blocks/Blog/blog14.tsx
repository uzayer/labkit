import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { Badge } from '@/components/ui/badge'
import { extractPlainText } from '@/utilities/richtext'
import type { BlogBlock, Post, Category, Media as MediaType } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

interface Blog14Props extends BlogBlock {
  publicContext: PublicContextProps
  posts?: Post[]
}

function getPostImage(post: Post): MediaType | null {
  const metaImage = post.meta?.image
  if (typeof metaImage === 'object' && metaImage) return metaImage
  const banner = post.bannerImage
  if (typeof banner === 'object' && banner) return banner
  return null
}

function getCategories(post: Post): Category[] {
  if (!post.categories || !Array.isArray(post.categories)) return []
  return post.categories
    .map((cat) => (typeof cat === 'object' ? cat : null))
    .filter(Boolean) as Category[]
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '\u2026'
}

const Blog14: React.FC<Blog14Props> = (props) => {
  const { publicContext, richText, sectionLabel, posts } = props

  if (!Array.isArray(posts) || posts.length === 0) return null

  const [featured, ...rest] = posts

  return (
    <section className="py-32">
      <div className="container">
        {richText && (
          <div className="mb-16 text-center">
            <RichText
              content={richText}
              publicContext={publicContext}
              withWrapper={false}
              overrideStyle={{
                h1: 'text-5xl font-medium md:text-6xl',
                h2: 'text-5xl font-medium md:text-6xl',
                p: 'text-muted-foreground mx-auto mt-4 max-w-xl text-lg',
              }}
            />
          </div>
        )}

        <div className="mx-auto max-w-7xl">
          {featured && (
            <CMSLink
              url={featured.slug ? `/posts/${featured.slug}` : '#'}
              publicContext={publicContext}
            >
              <div className="my-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-16">
                {(() => {
                  const image = getPostImage(featured)
                  return typeof image === 'object' && image ? (
                    <Media
                      resource={image}
                      imgClassName="aspect-video rounded-lg object-cover"
                      htmlElement={null}
                    />
                  ) : (
                    <div className="bg-muted aspect-video rounded-lg" />
                  )
                })()}
                <div className="flex flex-col items-start gap-4">
                  {getCategories(featured).map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="shrink">
                      {cat.title}
                    </Badge>
                  ))}
                  <h3 className="text-2xl font-semibold text-balance md:max-w-lg lg:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="text-muted-foreground md:max-w-lg">
                    {truncate(
                      typeof featured.content === 'string'
                        ? featured.content
                        : extractPlainText(featured.content),
                      200,
                    )}
                  </p>
                </div>
              </div>
            </CMSLink>
          )}

          {rest.length > 0 && (
            <>
              {sectionLabel && <p className="text-2xl font-medium md:text-3xl">{sectionLabel}</p>}
              <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
                {rest.map((post) => {
                  const image = getPostImage(post)
                  const categories = getCategories(post)
                  const description =
                    typeof post.content === 'string' ? post.content : extractPlainText(post.content)

                  return (
                    <CMSLink
                      key={post.id}
                      url={post.slug ? `/posts/${post.slug}` : '#'}
                      publicContext={publicContext}
                    >
                      <div className="flex flex-col items-start gap-4">
                        {typeof image === 'object' && image ? (
                          <Media
                            resource={image}
                            imgClassName="aspect-video w-full rounded-lg object-cover"
                            htmlElement={null}
                          />
                        ) : (
                          <div className="bg-muted aspect-video w-full rounded-lg" />
                        )}
                        {categories.map((cat) => (
                          <Badge key={cat.id} variant="secondary" className="shrink">
                            {cat.title}
                          </Badge>
                        ))}
                        <h3 className="text-xl font-semibold text-balance md:max-w-md">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground md:max-w-md">
                          {truncate(description, 150)}
                        </p>
                      </div>
                    </CMSLink>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export { Blog14 }
