import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import type { CareersBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { ArrowRight, MapPin } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

const Careers3: React.FC<CareersBlock & { publicContext: PublicContextProps }> = ({
  headline,
  jobCategories,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          {headline && (
            <RichText
              publicContext={publicContext}
              content={headline}
              withWrapper={false}
              overrideStyle={{
                h1: 'text-3xl font-bold md:text-5xl',
                h2: 'text-3xl font-bold md:text-5xl',
              }}
            />
          )}
          {Array.isArray(jobCategories) && jobCategories.length > 0 && (
            <div className="mx-auto mt-14 flex flex-col gap-16">
              {jobCategories.map((jobCategory) => (
                <div key={jobCategory.id}>
                  {jobCategory.category && <Badge>{jobCategory.category}</Badge>}
                  {Array.isArray(jobCategory.openings) && jobCategory.openings.length > 0 && (
                    <div>
                      {jobCategory.openings.map((opening) => (
                        <CMSLink
                          key={opening.id}
                          {...opening.link}
                          appearance="inline"
                          className="group block border-b py-7"
                          publicContext={publicContext}
                        >
                          {opening.title && (
                            <h3 className="text-xl font-semibold group-hover:underline">
                              {opening.title}
                            </h3>
                          )}
                          {opening.description && (
                            <p className="text-muted-foreground mt-1 font-medium">
                              {opening.description}
                            </p>
                          )}
                          <div className="text-muted-foreground mt-4 flex justify-between gap-4">
                            {opening.location && (
                              <div className="flex gap-2 text-sm md:text-base">
                                <MapPin className="h-auto w-4 shrink-0" />
                                <p>{opening.location}</p>
                              </div>
                            )}
                            <ArrowRight className="h-auto w-4" />
                          </div>
                        </CMSLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Careers3
