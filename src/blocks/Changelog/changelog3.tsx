import { Separator } from '@/components/ui/separator'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Changelogblock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const tagColorMap: Record<string, string> = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  yellow: 'bg-amber-400',
}

const Changelog3: React.FC<Changelogblock & { publicContext: PublicContextProps }> = ({
  entries,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="space-y-10">
          {Array.isArray(entries) &&
            entries.length > 0 &&
            entries.map((entry, idx) => (
              <div key={entry.id}>
                <article className="relative mx-auto flex max-w-3xl flex-col gap-6 md:flex-row md:gap-10">
                  <time className="text-muted-foreground h-fit text-sm font-semibold md:sticky md:top-10">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <div>
                    {Array.isArray(entry.tags) && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {entry.tags.map((tag) => (
                          <div key={tag.id} className="flex items-center gap-1.5">
                            <span
                              className={`h-3 w-3 rounded-full ${tagColorMap[tag.tagColor || 'blue'] || 'bg-blue-500'}`}
                            />
                            <p className="text-primary/80 text-sm font-semibold">{tag.tagName}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {entry.description && (
                      <div className="prose dark:prose-invert mt-6">
                        <RichText
                          publicContext={publicContext}
                          content={entry.description}
                          withWrapper={false}
                          overrideStyle={{
                            h2: 'text-2xl font-bold',
                            p: 'text-base',
                          }}
                        />
                      </div>
                    )}
                    {entry.image && (
                      <Media
                        imgClassName="border-border my-4 aspect-video rounded-lg border object-cover"
                        resource={entry.image}
                      />
                    )}
                  </div>
                </article>
                {idx < entries.length - 1 && <Separator className="mt-10" />}
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export { Changelog3 }
