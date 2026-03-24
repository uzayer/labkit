import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Hero11 = () => {
  return (
    <section className="py-32">
      <section className="mb-32 border-b pt-32">
        <div className="container max-w-7xl">
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <div className="z-10 flex flex-col items-center gap-6 text-center">
              <img
                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                alt="logo"
                className="h-16"
              />
              <div>
                <h1 className="mb-4 text-2xl font-medium text-pretty lg:text-4xl">
                  Build your next project with Blocks
                </h1>
                <p className="text-muted-foreground lg:text-xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia
                  fugiat omnis! Porro facilis quo animi consequatur. Explicabo.
                </p>
              </div>
              <Button>
                Get started now
                <ChevronRight className="ml-2 h-4" />
              </Button>
            </div>
          </div>
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder.svg"
            alt="placeholder"
            className="mt-20 max-h-96 w-full rounded-t-lg object-cover"
          />
        </div>
      </section>
    </section>
  )
}

export default Hero11
