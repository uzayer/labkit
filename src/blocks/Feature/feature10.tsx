import { PersonStanding, Timer, Zap, ZoomIn } from 'lucide-react'

const Feature10 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <p className="text-muted-foreground mb-4 text-xs">Why Us?</p>
        <h2 className="text-3xl font-medium lg:text-4xl">A better way to build websites</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="bg-accent mb-8 flex size-10 shrink-0 items-center justify-center rounded-full md:size-12">
              <Timer className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Performance
                <span className="bg-primary absolute -left-px hidden h-6 w-px md:inline-block"></span>
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sunt beatae tenetur.
              </p>
            </div>
          </div>
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="bg-accent mb-8 flex size-10 shrink-0 items-center justify-center rounded-full md:size-12">
              <Zap className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Innovation
                <span className="bg-primary absolute -left-px hidden h-6 w-px md:inline-block"></span>
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sunt beatae tenetur.
              </p>
            </div>
          </div>
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="bg-accent mb-8 flex size-10 shrink-0 items-center justify-center rounded-full md:size-12">
              <ZoomIn className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Quality
                <span className="bg-primary absolute -left-px hidden h-6 w-px md:inline-block"></span>
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sunt beatae tenetur.
              </p>
            </div>
          </div>
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="bg-accent mb-8 flex size-10 shrink-0 items-center justify-center rounded-full md:size-12">
              <PersonStanding className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Accessibility
                <span className="bg-primary absolute -left-px hidden h-6 w-px md:inline-block"></span>
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sunt beatae tenetur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feature10
