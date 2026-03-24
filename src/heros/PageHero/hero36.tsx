import { ArrowRight } from 'lucide-react'

const Hero36 = () => {
  return (
    <section className="bg-accent relative overflow-hidden py-32">
      <div className="relative container flex flex-col items-center text-center">
        <p className="text-xs uppercase">New Release</p>
        <h1 className="my-3 max-w-4xl text-2xl font-bold text-pretty sm:text-4xl md:my-6 lg:text-5xl">
          Our blocks help global companies expand into new markets
        </h1>
      </div>
      <div className="container mt-16 grid gap-8 md:mt-24 md:grid-cols-3">
        <a
          href="#"
          className="group bg-background flex flex-col items-center rounded-lg px-6 py-10 text-center lg:px-8 lg:py-16"
        >
          <div className="mb-8 flex aspect-square w-16 items-center justify-center md:w-25 lg:mb-13">
            <img
              src="https://www.shadcnblocks.com/images/block/block-1.svg"
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
          <div className="mt-10 flex items-center md:mt-16">
            <span>See more</span>
            <ArrowRight className="ml-2 size-5 transition-all group-hover:translate-x-1" />
          </div>
        </a>
        <a
          href="#"
          className="group bg-background flex flex-col items-center rounded-lg px-6 py-10 text-center lg:px-8 lg:py-16"
        >
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
          <div className="mt-10 flex items-center md:mt-16">
            <span>See more</span>
            <ArrowRight className="ml-2 size-5 transition-all group-hover:translate-x-1" />
          </div>
        </a>
        <a
          href="#"
          className="group bg-background flex flex-col items-center rounded-lg px-6 py-10 text-center lg:px-8 lg:py-16"
        >
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
          <div className="mt-10 flex items-center md:mt-16">
            <span>See more</span>
            <ArrowRight className="ml-2 size-5 transition-all group-hover:translate-x-1" />
          </div>
        </a>
      </div>
    </section>
  )
}

export default Hero36
