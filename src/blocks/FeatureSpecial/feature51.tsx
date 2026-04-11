import { Lightbulb, ListChecks, MessageCircleMore } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Feature51 = () => {
  return (
    <section className="py-32">
      <div className="container max-w-5xl">
        <Tabs defaultValue="feature-1">
          <TabsList className="bg-background flex h-auto w-full flex-col gap-2 md:flex-row">
            <TabsTrigger
              value="feature-1"
              className="text-primary hover:border-primary/40 data-[state=active]:border-primary flex w-full flex-col items-start justify-start gap-1 rounded-md border p-4 text-left whitespace-normal"
            >
              <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                <span className="bg-accent flex size-8 items-center justify-center rounded-full lg:size-10">
                  <MessageCircleMore className="text-primary size-4" />
                </span>
                <p className="text-lg font-semibold md:text-2xl lg:text-xl">Get Started</p>
              </div>
              <p className="text-muted-foreground font-normal md:block">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="feature-2"
              className="text-primary hover:border-primary/40 data-[state=active]:border-primary flex w-full flex-col items-start justify-start gap-1 rounded-md border p-4 text-left whitespace-normal"
            >
              <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                <span className="bg-accent flex size-8 items-center justify-center rounded-full lg:size-10">
                  <Lightbulb className="text-primary size-4" />
                </span>
                <p className="text-lg font-semibold md:text-2xl lg:text-xl">Get Ideas</p>
              </div>
              <p className="text-muted-foreground font-normal md:block">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="feature-3"
              className="text-primary hover:border-primary/40 data-[state=active]:border-primary flex w-full flex-col items-start justify-start gap-1 rounded-md border p-4 text-left whitespace-normal"
            >
              <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                <span className="bg-accent flex size-8 items-center justify-center rounded-full lg:size-10">
                  <ListChecks className="text-primary size-4" />
                </span>
                <p className="text-lg font-semibold md:text-2xl lg:text-xl">Build</p>
              </div>
              <p className="text-muted-foreground font-normal md:block">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feature-1">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
              alt=""
              className="aspect-video rounded-md object-cover"
            />
          </TabsContent>
          <TabsContent value="feature-2">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-2.svg"
              alt=""
              className="aspect-video rounded-md object-cover"
            />
          </TabsContent>
          <TabsContent value="feature-3">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-3.svg"
              alt=""
              className="aspect-video rounded-md object-cover"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default Feature51
