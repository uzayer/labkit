import { ArrowRight, Blocks, MessagesSquare, MoveRight, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const Hero26 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="text-center">
          <a
            href="#"
            className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full border px-2 py-1 text-sm"
          >
            <Badge>NEW</Badge>
            Introducing Collaboration 2.0
            <span className="bg-muted flex size-7 items-center justify-center rounded-full">
              <ArrowRight className="w-4" />
            </span>
          </a>
          <h1 className="mx-auto mt-4 mb-3 max-w-3xl text-4xl font-semibold text-balance lg:mb-7 lg:text-7xl">
            Unlock the power of collaboration
          </h1>
          <p className="m text-muted-foreground mx-auto max-w-3xl lg:text-xl">
            Collaboration 2.0 is the ultimate platform for
            <span className="text-primary relative top-[5px] mx-2 inline-flex font-medium md:top-[3px]">
              <Users className="mr-1 w-4 md:w-5" />
              Teams
            </span>
            to
            <span className="text-primary relative top-[5px] mx-2 inline-flex font-medium md:top-[3px]">
              <Blocks className="mr-1 w-5" />
              Collaborate,
            </span>
            <span className="text-primary relative top-[5px] mx-2 inline-flex font-medium md:top-[3px]">
              <MessagesSquare className="mr-1 w-5" />
              Communicate,
            </span>
            and achieve their goals. Get a head start with our free plan. No credit card required.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg">
              Get started for free
              <MoveRight className="ml-2" strokeWidth={1} />
            </Button>
            <Button size="lg" variant="ghost">
              Learn more
              <MoveRight className="ml-2" strokeWidth={1} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero26
