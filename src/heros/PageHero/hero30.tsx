import { Button } from '@/components/ui/button'

const Hero30 = () => {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="bg-muted absolute inset-0 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1400 656"
          className="min-h-full min-w-full"
        >
          <defs>
            <filter id="blur1" x="-20%" y="-20%" width="140%" height="140%">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="180" result="effect1_foregroundBlur" />
            </filter>
            <pattern id="innerGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(from_var(--background)_h_s_l)"
                strokeWidth="0.5"
                strokeOpacity={0.6}
              />
            </pattern>
            <pattern id="grid" width="160" height="160" patternUnits="userSpaceOnUse">
              <rect width="160" height="160" fill="url(#innerGrid)" />
              <path
                d="M 70 80 H 90 M 80 70 V 90"
                fill="none"
                stroke="hsl(from_var(--background)_h_s_l)"
                strokeWidth="1"
                strokeOpacity={0.3}
              />
            </pattern>
          </defs>
          <g filter="url(#blur1)">
            <rect width="1400" height="656" fill="hsl(from_var(--muted)_h_s_l)" />
            <rect
              x="0"
              y="0"
              width="1400"
              height="656"
              fill="hsl(from_var(--primary)_h_s_l/0.1)"
            ></rect>
            <g transform="translate(1400, 656)">
              <path
                d="M-623.2 0C-611 -116.2 -598.9 -232.4 -539.7 -311.6C-480.5 -390.8 -374.3 -433.1 -276.5 -478.9C-178.7 -524.7 -89.4 -573.9 0 -623.2L0 0Z"
                fill="hsl(from_var(--background)_h_s_l)"
              ></path>
            </g>
            <g transform="translate(0, 0)">
              <path
                d="M623.2 0C606.6 108.6 590.1 217.1 539.7 311.6C489.3 406.1 405.1 486.5 309.5 536.1C213.9 585.7 107 604.4 0 623.2L0 0Z"
                fill="hsl(from_var(--background)_h_s_l)"
              ></path>
            </g>
          </g>
          <rect width="1400" height="900" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
              Welcome to Our Website
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia
              fugiat omnis! Porro facilis quo animi consequatur. Explicabo.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button variant="outline" className="w-full sm:w-auto">
                Secondary
              </Button>
              <Button className="w-full sm:w-auto">Primary</Button>
            </div>
          </div>
          <div className="mt-16 -mb-16 flex justify-center gap-4 lg:my-0 lg:justify-end">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
              alt="placeholder hero"
              className="border-border h-[400px] rounded-lg border object-cover object-center sm:max-w-[320px]"
            />
            <div className="hidden flex-col gap-4 sm:flex lg:hidden 2xl:flex">
              <div className="border-border bg-background w-[256px] flex-1 rounded-lg border text-clip"></div>
              <div className="border-border bg-background aspect-2/1 w-[256px] rounded-lg border text-clip"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero30
