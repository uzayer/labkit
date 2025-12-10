import { Blocks, MoveRight, Wrench, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Hero25 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="text-center">
          <img
            src="https://www.shadcnblocks.com/images/block/block-4.svg"
            alt="placeholder"
            className="mx-auto mb-5 w-16 md:mb-6 md:w-24 lg:mb-7 lg:w-28"
          />
          <span className="text-muted-foreground mb-3 text-sm tracking-widest md:text-base">
            SYSTEMS
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-balance lg:text-6xl">
            A system crafted for team success and growth
          </h1>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg">
              Get started
              <MoveRight className="ml-2" strokeWidth={1} />
            </Button>
            <Button size="lg" variant="secondary">
              Read the docs
              <MoveRight className="ml-2" strokeWidth={1} />
            </Button>
          </div>
          <div className="mt-6 lg:mt-8">
            <ul className="text-muted-foreground flex flex-wrap justify-center gap-4 text-sm lg:text-base">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <Zap className="size-4" />
                Quick setup guide
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <Blocks className="size-4" />
                Fully customizable
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <Wrench className="size-4" />
                Easy to use components
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero25
