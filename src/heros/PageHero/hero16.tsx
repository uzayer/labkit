import { Button } from '@/components/ui/button'

const Hero16 = () => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-center py-12 text-center lg:py-32">
        <h1 className="my-3 text-2xl font-bold text-pretty sm:text-4xl md:my-6 lg:text-5xl">
          Welcome to Our Website
        </h1>
        <p className="text-muted-foreground mb-6 max-w-xl md:mb-12 lg:text-xl">
          Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur.
        </p>
        <div>
          <Button>Primary</Button>
        </div>
      </div>
      <div className="container">
        <div className="aspect-video mask-[linear-gradient(#000_80%,transparent_100%)]">
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder hero"
            className="size-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero16
