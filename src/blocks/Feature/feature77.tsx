import { ArrowRight } from 'lucide-react'

const Feature77 = () => {
  return (
    <section className="relative">
      <div className="relative container flex flex-col items-center">
        <div className="-mx-[calc(24px+theme(container.padding))] bg-border absolute top-0 h-px w-screen" />
        <div className="relative py-24 text-center lg:py-32">
          <p className="mb-6 text-xs font-medium tracking-wider uppercase">Tag Line</p>
          <h3 className="text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Feature group
          </h3>
        </div>
      </div>
      <div className="relative container">
        <div className="md:divide-border grid md:grid-cols-2 md:divide-x">
          <a
            href="#"
            className="group border-border relative flex flex-col items-center py-8 text-center transition-all duration-200 md:border-t md:px-8 md:py-12 lg:px-12 lg:pt-16 lg:pb-20"
          >
            <div className="bg-border absolute top-0 h-px w-full md:hidden" />
            <div className="mb-8 flex aspect-square w-16 items-center justify-center md:w-25 lg:mb-13">
              <img
                src="https://www.shadcnblocks.com/images/block/block-2.svg"
                alt="Product"
                className="size-full object-contain object-center"
              />
            </div>
            <h3 className="mb-4 text-lg font-semibold md:mb-5">Product</h3>
            <p className="text-muted-foreground mb-auto text-sm">
              Maecenas egestas leo nec risus viverra accumsan. Interdum et malesuada fames ac ante
              ipsum primis in faucibus. Donec ultricies, nisi non elementum convallis, lacus justo
              eleifend dolor, nec imperdiet nisi sem vel nisi.
            </p>
            <div className="mt-4 flex items-center md:mt-6">
              <span>See more</span>
              <ArrowRight className="ml-2 size-5 transition-all group-hover:translate-x-1" />
            </div>
          </a>
          <a
            href="#"
            className="group border-border relative flex flex-col items-center py-8 text-center transition-all duration-200 md:border-t md:px-8 md:py-12 lg:px-12 lg:pt-16 lg:pb-20"
          >
            <div className="bg-border absolute top-0 h-px w-full md:hidden" />
            <div className="mb-8 flex aspect-square w-16 items-center justify-center md:w-25 lg:mb-13">
              <img
                src="https://www.shadcnblocks.com/images/block/block-3.svg"
                alt="Product"
                className="size-full object-contain object-center"
              />
            </div>
            <h3 className="mb-4 text-lg font-semibold md:mb-5">Product</h3>
            <p className="text-muted-foreground mb-auto text-sm">
              Maecenas egestas leo nec risus viverra accumsan. Interdum et malesuada fames ac ante
              ipsum primis in faucibus. Donec ultricies, nisi non elementum convallis, lacus justo
              eleifend dolor, nec imperdiet nisi sem vel nisi.
            </p>
            <div className="mt-4 flex items-center md:mt-6">
              <span>See more</span>
              <ArrowRight className="ml-2 size-5 transition-all group-hover:translate-x-1" />
            </div>
          </a>
        </div>
        <div className="left-[calc(theme(container.padding)-25px)] bg-background absolute top-[-1.7rem] z-10 px-5 py-6">
          <div className="bg-primary size-[.75rem] rounded-full"></div>
        </div>
        <div className="right-[calc(theme(container.padding)-25px)] bg-background absolute top-[-1.7rem] z-10 px-5 py-6">
          <div className="bg-primary size-[.75rem] rounded-full"></div>
        </div>
        <div className="left-[calc(theme(container.padding)-25px)] bg-background absolute bottom-[-1.7rem] z-10 px-5 py-6">
          <div className="bg-primary size-[.75rem] rounded-full"></div>
        </div>
        <div className="right-[calc(theme(container.padding)-25px)] bg-background absolute bottom-[-1.7rem] z-10 px-5 py-6">
          <div className="bg-primary size-[.75rem] rounded-full"></div>
        </div>
        <div className="-mx-[calc(theme(container.padding))] bg-border absolute bottom-0 h-px w-screen" />
      </div>
      <div className="absolute inset-0 container hidden h-full md:block">
        <div className="relative h-full">
          <div className="bg-border absolute inset-y-0 left-0 h-full w-px"></div>
          <div className="bg-border absolute inset-y-0 right-0 h-full w-px"></div>
        </div>
      </div>
    </section>
  )
}

export default Feature77
