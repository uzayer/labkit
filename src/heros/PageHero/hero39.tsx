import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Hero39 = () => {
  return (
    <section>
      <div className="container flex flex-col items-center">
        <div className="bg-accent/50 2xl:w-[calc(min(100vw-2*theme(container.padding),100%+8rem))] w-full rounded-lg text-clip">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="container flex flex-col items-center p-16 text-center lg:mx-auto lg:items-start lg:px-16 lg:py-32 lg:text-left">
              <p>New Release</p>
              <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
                Welcome to Our Website
              </h1>
              <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia
                fugiat omnis! Porro facilis quo animi consequatur. Explicabo.
              </p>
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <Button className="w-full sm:w-auto">
                  <ArrowRight className="mr-2 size-4" />
                  Primary
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative aspect-7/8 size-full">
                <div className="border-border bg-accent absolute top-[12%] right-[50%] flex aspect-square w-[24%] justify-center rounded-lg border"></div>
                <div className="border-border bg-accent absolute top-[36%] right-[50%] flex aspect-5/6 w-2/5 justify-center rounded-lg border"></div>
                <div className="border-border bg-accent absolute bottom-[36%] left-[54%] flex aspect-5/6 w-2/5 justify-center rounded-lg border"></div>
                <div className="border-border bg-accent absolute bottom-[12%] left-[54%] flex aspect-square w-[24%] justify-center rounded-lg border"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero39
