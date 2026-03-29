// TODO: Not yet registered as a block variant. The email subscription form needs Payload's
// internal form submission mechanism. Once that's implemented, register as CHANGELOG2 in
// variants.ts, config.ts, and Component.tsx.

import { Badge } from '@/components/ui/badge'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Changelogblock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Changelog2: React.FC<Changelogblock & { publicContext: PublicContextProps }> = ({
  richText,
  tagline,
  entries,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="text-center">
          {richText && (
            <RichText
              publicContext={publicContext}
              content={richText}
              withWrapper={false}
              overrideStyle={{
                h1: 'mb-6 text-6xl font-semibold md:text-7xl',
                h2: 'mb-6 text-6xl font-semibold md:text-7xl',
                p: 'mx-auto max-w-lg text-lg',
              }}
            />
          )}
          {tagline && (
            <sup>
              <Badge className="ml-2 bg-emerald-400 hover:bg-emerald-400">{tagline}</Badge>
            </sup>
          )}
          {/* TODO: Replace with Payload form submission mechanism */}
          <div className="mx-auto mt-10 flex w-full max-w-xs items-center space-x-2">
            <p className="text-muted-foreground text-sm italic">
              Email subscription form — pending Payload form integration
            </p>
          </div>
        </div>
        <div className="border-border mx-auto mt-20 max-w-xl space-y-10 border-l border-dashed pl-6">
          {Array.isArray(entries) &&
            entries.length > 0 &&
            entries.map((entry) => (
              <div key={entry.id}>
                <p className="text-muted-foreground relative font-mono text-sm">
                  <time className="absolute top-1 -left-6 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-400" />
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {entry.image && (
                  <Media
                    imgClassName="my-4 aspect-8/7 rounded-md object-cover"
                    resource={entry.image}
                  />
                )}
                {entry.title && <h2 className="mb-2 text-3xl font-semibold">{entry.title}</h2>}
                {entry.description && (
                  <div className="prose text-primary/80 dark:prose-invert">
                    <RichText
                      publicContext={publicContext}
                      content={entry.description}
                      withWrapper={false}
                      overrideStyle={{
                        p: 'text-base',
                        li: 'text-base',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export { Changelog2 }
