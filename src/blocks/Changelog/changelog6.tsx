import { Copy, ExternalLink, GitPullRequest, Maximize2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Changelogblock, Media as MediaType } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Changelog6: React.FC<Changelogblock & { publicContext: PublicContextProps }> = ({
  richText,
  entries,
  publicContext,
}) => {
  return (
    <section className="overflow-clip py-32">
      <div className="border-border container border-x">
        <div className="relative flex flex-col gap-3 py-8">
          <div className="flex items-center gap-2">
            <GitPullRequest className="size-4" />
            <p className="text-sm font-medium">Changelog</p>
          </div>
          {richText && (
            <RichText
              publicContext={publicContext}
              content={richText}
              withWrapper={false}
              overrideStyle={{
                h1: 'text-3xl font-medium lg:text-4xl',
                h2: 'text-3xl font-medium lg:text-4xl',
                p: 'text-muted-foreground text-base',
              }}
            />
          )}
          <div className="bg-border absolute right-0 bottom-0 left-0 h-px w-[200vw] -translate-x-1/2" />
          <div className="bg-border absolute top-0 right-0 left-0 h-px w-[200vw] -translate-x-1/2" />
        </div>
        <div className="flex flex-col">
          {Array.isArray(entries) &&
            entries.length > 0 &&
            entries.map((entry) => (
              <Dialog key={entry.id}>
                <div className="relative flex w-full flex-col gap-4 py-16 lg:flex-row lg:gap-0">
                  <div className="top-2 left-0 mt-2 block h-fit lg:sticky">
                    <time className="text-muted-foreground w-36 text-sm font-medium lg:absolute">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <div className="flex max-w-prose flex-col gap-4 lg:mx-auto">
                    {entry.title && (
                      <h3 className="text-3xl font-medium lg:text-4xl">{entry.title}</h3>
                    )}
                    {entry.image && (
                      <DialogTrigger asChild>
                        <div className="cursor-pointer">
                          <Media
                            imgClassName="border-border max-h-96 w-full rounded-lg border object-cover"
                            resource={entry.image}
                          />
                        </div>
                      </DialogTrigger>
                    )}
                    {entry.excerpt && (
                      <p className="text-muted-foreground text-sm font-medium">{entry.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.isArray(entry.contributors) && entry.contributors.length > 0 && (
                          <>
                            <div className="flex items-center -space-x-2">
                              {(entry.contributors as MediaType[])
                                .slice(0, 3)
                                .map((contributor) => (
                                  <img
                                    key={
                                      typeof contributor === 'object' ? contributor.id : contributor
                                    }
                                    src={
                                      typeof contributor === 'object' ? (contributor.url ?? '') : ''
                                    }
                                    alt={
                                      typeof contributor === 'object' ? (contributor.alt ?? '') : ''
                                    }
                                    className="border-border size-6 rounded-full border"
                                  />
                                ))}
                            </div>
                            {entry.contributors.length > 3 && (
                              <span className="text-muted-foreground text-sm font-medium">
                                +{entry.contributors.length - 3} contributors
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Maximize2 className="size-4" />
                                </Button>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Show full release</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Copy className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ExternalLink className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open in new tab</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  <div className="bg-border absolute right-0 bottom-0 left-0 h-px w-[200vw] -translate-x-1/2" />
                </div>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-prose">
                  <DialogHeader>
                    <DialogTitle className="text-left">{entry.title}</DialogTitle>
                    {entry.excerpt && (
                      <DialogDescription className="text-left">{entry.excerpt}</DialogDescription>
                    )}
                  </DialogHeader>
                  {entry.image && (
                    <Media
                      imgClassName="border-border max-h-96 w-full rounded-lg border object-cover"
                      resource={entry.image}
                    />
                  )}
                  {entry.description && (
                    <div className="prose dark:prose-invert">
                      <RichText
                        publicContext={publicContext}
                        content={entry.description}
                        withWrapper={false}
                        overrideStyle={{
                          h3: 'text-xl font-semibold',
                          h4: 'text-lg font-semibold',
                          p: 'text-base',
                          li: 'text-base',
                        }}
                      />
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
        </div>
      </div>
    </section>
  )
}

export { Changelog6 }
