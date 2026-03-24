import { Button } from '@/components/ui/button'

const Hero28 = () => {
  return (
    <section className="relative py-32">
      {/* Background pattern */}
      <div className="absolute inset-x-0 top-0 container hidden h-full overflow-hidden lg:block">
        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1400 520"
            className="w-[calc(100%+2*theme(container.padding))] -mx-8"
          >
            <defs>
              <radialGradient id="text-backgroud" cx="50%" cy="50%" r={0.6}>
                <stop stopColor="black" offset={0.4} />
                <stop stopColor="black" offset={1} stopOpacity={0} />
              </radialGradient>
              <linearGradient id="icon-backgroud" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="hsl(from_var(--accent)_h_s_l)" offset={0} />
                <stop stopColor="hsl(from_var(--background)_h_s_l)" offset={1} />
              </linearGradient>
              <mask id="mask">
                <rect x="0" y="0" width="100%" height="100%" stroke="none" fill="black" />
                <rect
                  x="80"
                  y="40"
                  width="1260"
                  height="380"
                  rx="140"
                  stroke="none"
                  filter="url(#blur)"
                  fill="white"
                />
                <rect
                  x="40"
                  y="-120"
                  width="1320"
                  height="600"
                  stroke="none"
                  fill="url(#text-backgroud)"
                />
              </mask>
              <filter id="blur-sm" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
              </filter>
            </defs>
            <path
              stroke="hsl(from_var(--border)_h_s_l)"
              strokeWidth={1}
              d="M0,40H1400M0,120H1400M0,200H1400M0,280H1400M0,360H1400M0,440H1400M60,0V520M140,0V520M220,0V520M300,0V520M380,0V520M460,0V520M540,0V520M620,0V520M700,0V520M780,0V520M860,0V520M940,0V520M1020,0V520M1100,0V520M1180,0V520M1260,0V520M1340,0V520"
              mask="url(#mask)"
            />
            <rect
              x={140}
              y={120}
              width={80}
              height={80}
              stroke="hsl(from_var(--border)_h_s_l/0.5)"
              fill="url(#icon-backgroud)"
            />
            <image
              href="https://www.shadcnblocks.com/images/block/block-1.svg"
              x={160}
              y={140}
              width={40}
              height={40}
            />
            <rect
              x={60}
              y={280}
              width={80}
              height={80}
              stroke="hsl(from_var(--border)_h_s_l/0.5)"
              fill="url(#icon-backgroud)"
            />
            <image
              href="https://www.shadcnblocks.com/images/block/block-2.svg"
              x={80}
              y={300}
              width={40}
              height={40}
            />
            <rect
              x={300}
              y={360}
              width={80}
              height={80}
              stroke="hsl(from_var(--border)_h_s_l/0.5)"
              fill="url(#icon-backgroud)"
            />
            <image
              href="https://www.shadcnblocks.com/images/block/block-3.svg"
              x={320}
              y={380}
              width={40}
              height={40}
            />
            <rect
              x={1180}
              y={40}
              width={80}
              height={80}
              stroke="hsl(from_var(--border)_h_s_l/0.5)"
              fill="url(#icon-backgroud)"
            />
            <image
              href="https://www.shadcnblocks.com/images/block/block-4.svg"
              x={1200}
              y={60}
              width={40}
              height={40}
            />
            <rect
              x={1260}
              y={280}
              width={80}
              height={80}
              stroke="hsl(from_var(--border)_h_s_l/0.5)"
              fill="url(#icon-backgroud)"
            />
            <image
              href="https://www.shadcnblocks.com/images/block/block-5.svg"
              x={1280}
              y={300}
              width={40}
              height={40}
            />
          </svg>
        </div>
      </div>
      <div className="relative container flex flex-col items-center text-center">
        <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">Welcome to Our Website</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl lg:text-xl">
          Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur.
        </p>
        <div>
          <Button>Primary</Button>
        </div>
      </div>
    </section>
  )
}

export default Hero28
