import { Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Hero51 = () => {
  return (
    <section className="py-32">
      <div className="">
        <div className="relative container mx-auto max-w-screen-sm py-10 text-center">
          <div className="absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(from_var(--muted)_h_s_l)_1px,transparent_1px),linear-gradient(to_bottom,hsl(from_var(--muted)_h_s_l)_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_100%_at_50%_50%,#000_60%,transparent_100%)] bg-size-[64px_64px]"></div>
          <h1 className="mb-3 text-4xl lg:text-7xl">Explore a World of Digital Assets</h1>
          <p className="text-muted-foreground mb-5 text-sm md:text-base">
            Discover the future of asset management, tokenization, and liquidity with our
            comprehensive marketplace.
          </p>
          <Button>Marketplace</Button>
          <div className="mt-7 flex items-start justify-center gap-2 font-medium md:text-xl">
            <Globe className="mt-0.5 h-auto w-5" />
            Global Partnerships and Innovation
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-screen-xl overflow-hidden py-8">
          <div className="relative w-full">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
              alt="placeholder"
              className="relative left-1/2 mx-auto max-h-[480px] w-full rounded-xl object-cover shadow-md lg:static lg:max-w-[60vw] xl:max-w-screen-md"
            />
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-2.svg"
              alt="placeholder"
              className="absolute top-0 right-20 -z-10 hidden max-h-60 -rotate-12 rounded-xl object-cover shadow-md lg:block"
            />
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-2.svg"
              alt="placeholder"
              className="absolute right-20 bottom-0 hidden rotate-12 rounded-xl object-cover shadow-md md:max-h-60 lg:block"
            />
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-3.svg"
              alt="placeholder"
              className="absolute top-0 left-1/4 -z-10 max-h-44 -rotate-12 rounded-xl object-cover shadow-md min-[450px]:max-h-52 sm:left-1/3 md:max-h-60 lg:left-20"
            />
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-4.svg"
              alt="placeholder"
              className="absolute bottom-0 left-1/4 max-h-44 rotate-12 rounded-xl object-cover shadow-md min-[450px]:max-h-52 sm:left-1/3 md:max-h-60 lg:left-20"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero51
