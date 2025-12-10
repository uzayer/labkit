'use client'

import { useState } from 'react'

import { cn } from '@/utilities/cn'

import { BorderBeam } from '@/components/magicui/border-beam'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Page } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Icon } from '@/components/Icon'
const Hero195: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  richText,
  links,
  tabs,
  publicContext,
}) => {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.title || '')

  if (!tabs) return null
  return (
    <section className="overflow-x-hidden overflow-y-hidden">
      <div className="container">
        <div className="border-border border-x py-20">
          <div className="relative mx-auto max-w-2xl p-2">
            {richText && (
              <RichText
                publicContext={publicContext}
                className="relative mx-auto max-w-2xl p-2"
                content={richText}
                enableGutter={false}
                overrideStyle={{
                  h1: 'mx-1 mt-6 text-center text-5xl font-bold tracking-tighter md:text-7xl',
                  p: 'mx-2 mt-6 max-w-xl text-center text-lg font-medium text-muted-foreground md:text-xl',
                }}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <div className="mx-2 mt-6 flex justify-center gap-2">
                {links.map(({ link }, i) => {
                  return <CMSLink publicContext={publicContext} key={i} {...link} />
                })}
              </div>
            )}
          </div>
          <div className="mt-16 md:mt-20">
            <Tabs defaultValue={tabs[0]?.title} onValueChange={setActiveTab}>
              <div className="px-2">
                <TabsList className="mx-auto mb-6 flex h-auto w-fit max-w-xs flex-wrap justify-center gap-2 md:max-w-none">
                  {tabs.map(({ title, icon }, index) => (
                    <TabsTrigger
                      key={index}
                      value={title}
                      className="text-muted-foreground font-normal"
                    >
                      {icon && <Icon icon={icon} className="mr-1.5 size-5" />}
                      {title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="relative isolate">
                <div className="relative z-10">
                  {tabs.map(({ title, image }, index) => (
                    <TabsContent
                      key={index}
                      value={title}
                      className={cn('bg-background -mx-px transition-opacity duration-500', {
                        'animate-in fade-in opacity-100': activeTab === title,
                        'opacity-0': activeTab !== title,
                      })}
                    >
                      <Media
                        imgClassName="aspect-[16/10] w-full border border-border object-top shadow-[0_6px_20px_rgb(0,0,0,0.12)]"
                        priority={index === 0}
                        resource={image}
                      />
                      <BorderBeam duration={8} size={100} />
                    </TabsContent>
                  ))}
                </div>
                <span className="bg-border absolute -inset-x-1/5 top-0 -z-10 h-px [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>
                <span className="bg-border absolute -inset-x-1/5 bottom-0 -z-10 h-px [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>

                <span className="border-border absolute -inset-x-1/5 top-12 h-px border-t border-dashed [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>
                <span className="border-border absolute -inset-x-1/5 bottom-12 h-px border-t border-dashed [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>

                <span className="border-border absolute -inset-y-1/5 left-1/6 w-px border-r border-dashed [mask-image:linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>
                <span className="border-border absolute -inset-y-1/5 right-1/6 w-px border-r border-dashed [mask-image:linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero195
