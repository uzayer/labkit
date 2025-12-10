import { Minus } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Hero50 = () => {
  return (
    <section className="py-32">
      <div className="container flex flex-col gap-7 text-center">
        <a
          href="#"
          className="group mx-auto mb-3 w-fit gap-3 rounded-full border px-5 py-2 text-sm"
        >
          <span className="mr-1 font-medium">Join our Community Collaboration Survey!</span>
          We’ll donate $20 for each response.
          <Minus className="mx-1 inline-block w-4" />
          <span className="font-semibold group-hover:underline">Take a tour</span>
        </a>
        <h1 className="mx-auto max-w-4xl text-4xl font-semibold text-balance lg:text-6xl">
          Community & business data, centralized
        </h1>
        <p className="text-muted-foreground mx-auto max-w-4xl lg:text-xl">
          Showcase the value of your community to the business. Talkbase sets the stage for
          successful cross-collaboration among community teams working with customer, marketing,
          sales, and product development.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg">Get started for free</Button>
          <Button size="lg" variant="outline">
            Book a demo
          </Button>
        </div>
      </div>
      <div className="relative px-8">
        <div className="from-muted absolute inset-0 top-1/2 size-full bg-linear-to-b to-transparent to-50%"></div>
        <div className="relative mx-auto max-w-screen-lg">
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder"
            className="mt-20 max-h-[580px] w-full rounded-lg object-cover shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
          />
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder-dark-2.svg"
            alt="placeholder"
            className="absolute top-1/2 -left-3 hidden max-h-56 -translate-y-1/2 rounded-lg object-cover shadow-md md:block xl:-left-10"
          />
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder-dark-3.svg"
            alt="placeholder"
            className="bg-muted2 absolute top-1/3 -right-3 hidden size-24 -translate-y-1/2 rounded-lg shadow-md md:block xl:-right-10"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero50
