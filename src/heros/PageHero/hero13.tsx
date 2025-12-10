import { Bell, PlayCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const Hero13 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <Badge
          variant="outline"
          className="mb-4 max-w-full text-sm font-normal lg:mb-10 lg:py-2 lg:pr-5 lg:pl-2"
        >
          <span className="bg-accent mr-2 flex size-8 shrink-0 items-center justify-center rounded-full">
            <Bell className="size-4" />
          </span>
          <p className="truncate whitespace-nowrap">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi eaque distinctio iusto
            voluptas voluptatum sed!
          </p>
        </Badge>
        <h1 className="mb-6 text-4xl leading-none font-bold tracking-tighter md:text-[7vw] lg:text-8xl">
          Streamline your workflow experience.
        </h1>
        <p className="text-muted-foreground max-w-2xl md:text-[2vw] lg:text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolor assumenda
          voluptatem nemo magni a maiores aspernatur.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row lg:mt-10">
          <Button size={'lg'} className="w-full md:w-auto">
            Get a demo
          </Button>
          <Button size={'lg'} variant={'outline'} className="w-full md:w-auto">
            <PlayCircle className="mr-2 size-4" />
            Watch video
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero13
