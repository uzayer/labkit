import { Button } from '@/components/ui/button'

const Hero27 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:gap-20 lg:flex-row lg:items-end">
          <h1 className="text-6xl leading-none font-bold tracking-tighter md:text-[8vw] lg:w-3/5 2xl:text-9xl">
            HIGH
            <br />
            SCALE
            <br />
            HEADING.
          </h1>
          <div className="lg:max-w-auto max-w-lg space-y-4 lg:mb-4 lg:w-2/5">
            <p className="text-xl font-bold md:text-4xl">
              SMALL
              <br />
              SUBHEADING.
              <br />
            </p>
            <p className="text-muted-foreground text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, optio quis? Veniam
              accusamus quaerat illum dolorem eos atque reiciendis numquam. Veniam accusamus quaerat
              illum
            </p>
            <Button className="mt-6" size={'lg'}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero27
