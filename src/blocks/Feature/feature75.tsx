import { ArrowRight } from 'lucide-react'

const Feature75 = () => {
  return (
    <section className="py-32">
      <div className="container grid gap-y-12 md:grid-cols-12 md:gap-x-6 md:gap-y-0">
        <div className="md:col-span-6 lg:col-span-5">
          <h2 className="mb-3 text-xl font-semibold md:mb-4 md:text-4xl lg:mb-6">Feature name</h2>
          <p className="text-muted-foreground mb-8 lg:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat
            omnis! Porro facilis quo animi consequatur. Explicabo.
          </p>
        </div>
        <div className="grid gap-y-5 md:col-span-6 md:gap-y-7.5 lg:col-start-7">
          <a
            href="#"
            className="group bg-accent flex flex-col justify-center rounded-2xl px-6 py-8 text-clip md:px-8 md:py-10 lg:px-10 lg:py-12"
          >
            <p className="mb-3 text-xs font-medium tracking-wider uppercase">Tag Line</p>
            <p className="text-muted-foreground mb-12 font-semibold lg:text-xl">
              Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa
              consectetur, id interdum ante congue.
            </p>
            <div className="border-primary group-hover:bg-primary group-hover:text-primary-foreground flex w-fit items-center gap-4 rounded-full border px-6 py-4">
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /> Learn
              more
            </div>
          </a>
          <a
            href="#"
            className="group bg-accent flex flex-col justify-center rounded-2xl px-6 py-8 text-clip md:px-8 md:py-10 lg:px-10 lg:py-12"
          >
            <p className="mb-3 text-xs font-medium tracking-wider uppercase">Tag Line</p>
            <p className="text-muted-foreground mb-12 font-semibold lg:text-xl">
              Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa
              consectetur, id interdum ante congue.
            </p>
            <div className="border-primary group-hover:bg-primary group-hover:text-primary-foreground flex w-fit items-center gap-4 rounded-full border px-6 py-4">
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /> Learn
              more
            </div>
          </a>
          <a
            href="#"
            className="group bg-accent flex flex-col justify-center rounded-2xl px-6 py-8 text-clip md:px-8 md:py-10 lg:px-10 lg:py-12"
          >
            <p className="mb-3 text-xs font-medium tracking-wider uppercase">Tag Line</p>
            <p className="text-muted-foreground mb-12 font-semibold lg:text-xl">
              Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa
              consectetur, id interdum ante congue.
            </p>
            <div className="border-primary group-hover:bg-primary group-hover:text-primary-foreground flex w-fit items-center gap-4 rounded-full border px-6 py-4">
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /> Learn
              more
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Feature75
