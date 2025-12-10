import { HandHelping, Users, Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const Hero45 = () => {
  return (
    <section className="py-32">
      <div className="container overflow-hidden">
        <div className="mb-20 flex flex-col items-center gap-6 text-center">
          <Badge variant="outline">Easy to use</Badge>
          <div>
            <h1 className="text-4xl font-semibold lg:text-6xl">
              Where Scale
              <br /> meets Performance
            </h1>
          </div>
        </div>
        <div className="relative mx-auto max-w-screen-lg">
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder"
            className="aspect-video max-h-[500px] w-full rounded-xl object-cover"
          />
          <div className="from-background absolute inset-0 bg-linear-to-t via-transparent to-transparent"></div>
          <div className="absolute -top-28 -right-28 -z-10 aspect-video h-72 w-96 mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] bg-size-[12px_12px] opacity-40 sm:bg-[radial-gradient(hsl(from_var(--muted-foreground)_h_s_l)_1px,transparent_1px)]"></div>
          <div className="absolute -top-28 -left-28 -z-10 aspect-video h-72 w-96 mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] bg-size-[12px_12px] opacity-40 sm:bg-[radial-gradient(hsl(from_var(--muted-foreground)_h_s_l)_1px,transparent_1px)]"></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-screen-lg flex-col md:flex-row">
          <div className="bg-background flex grow basis-0 flex-col rounded-md p-4">
            <div className="bg-background mb-6 flex size-10 items-center justify-center rounded-full drop-shadow-lg">
              <HandHelping className="h-auto w-5" />
            </div>
            <h3 className="mb-2 font-semibold">Flexible Support</h3>
            <p className="text-muted-foreground text-sm">
              Benefit from around-the-clock assistance to keep your business running smoothly.
            </p>
          </div>
          <Separator
            orientation="vertical"
            className="from-muted to-muted mx-6 hidden h-auto w-[2px] bg-linear-to-b via-transparent md:block"
          />
          <div className="bg-background flex grow basis-0 flex-col rounded-md p-4">
            <div className="bg-background mb-6 flex size-10 items-center justify-center rounded-full drop-shadow-lg">
              <Users className="h-auto w-5" />
            </div>
            <h3 className="mb-2 font-semibold">Collaborative Tools</h3>
            <p className="text-muted-foreground text-sm">
              Enhance teamwork with tools designed to simplify project management and communication.
            </p>
          </div>
          <Separator
            orientation="vertical"
            className="from-muted to-muted mx-6 hidden h-auto w-[2px] bg-linear-to-b via-transparent md:block"
          />
          <div className="bg-background flex grow basis-0 flex-col rounded-md p-4">
            <div className="bg-background mb-6 flex size-10 items-center justify-center rounded-full drop-shadow-lg">
              <Zap className="h-auto w-5" />
            </div>
            <h3 className="mb-2 font-semibold">Lightning Fast Speed</h3>
            <p className="text-muted-foreground text-sm">
              Experience the fastest load times with our high performance servers.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero45
