import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Flag } from 'lucide-react'

import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/badge'
import { FeatureBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

const Feature105: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({
  richText,
  badge,
  USPs,
  publicContext,
}) => {
  const tabs = USPs?.map(({ tagline, uspIcon, image }) => ({
    value: tagline,
    label: tagline,
    icon: uspIcon,
    image: image,
  }))

  if (!tabs) return null

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1 px-2.5 py-1.5 text-sm">
            <Flag className="h-auto w-4" />
            {badge}
          </Badge>
          {richText && (
            <RichText
              publicContext={publicContext}
              content={richText}
              withWrapper={false}
              overrideStyle={{
                h2: 'text-center text-3xl font-semibold lg:text-4xl',
                p: 'text-center text-muted-foreground lg:text-lg',
              }}
            />
          )}
        </div>
        <div className="mx-auto mt-14 max-w-screen-xl">
          <Tabs defaultValue={tabs[0]?.value as string}>
            <div className="max-w-[100vw-4rem] overflow-x-auto">
              <TabsList className="mx-auto flex w-fit justify-center gap-5 border-b">
                {tabs.map(({ value, label, icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value as string}
                    className="group data-[state=active]:border-primary -mb-px flex flex-col items-center gap-1.5 px-1 pb-3.5 data-[state=active]:border-b"
                  >
                    <span className="bg-muted group-data-[state=active]:bg-primary group-data-[state=active]:text-background flex size-12 items-center justify-center rounded-md transition-colors duration-300">
                      {icon && <Icon icon={icon} className="w-7" />}
                    </span>
                    <p className="text-muted-foreground text-sm">{label}</p>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="mt-5">
              {tabs.map(({ value, image, label }) => (
                <TabsContent key={value} value={value as string} className="aspect-video">
                  {image && (
                    <Media
                      resource={image}
                      imgClassName="size-full rounded-xl border object-cover"
                      className="aspect-video"
                    />
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default Feature105
