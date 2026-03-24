import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Page } from '@/payload-types'

export const Hero8: React.FC<Page['hero']> = ({}) => {
  return (
    <section className="py-32">
      <div className="border-muted overflow-hidden border-b">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <div className="z-10 items-center text-center">
              <h1 className="mb-8 text-4xl font-medium text-pretty lg:text-8xl">
                Build your next project with Blocks
              </h1>
              <p className="text-muted-foreground mx-auto max-w-screen-md lg:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia
                fugiat omnis! Porro facilis quo animi consequatur. Explicabo.
              </p>
              <div className="mt-12 flex w-full flex-col justify-center gap-2 sm:flex-row">
                <Button>
                  Get started now
                  <ChevronRight className="ml-2 h-4" />
                </Button>
                <Button variant="ghost">
                  Learn more
                  <ChevronRight className="ml-2 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder.svg"
            alt="placeholder"
            className="mx-auto mt-24 max-h-[700px] w-full max-w-7xl rounded-t-lg object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
