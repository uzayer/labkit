import { Globe } from 'lucide-react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Hero53 = () => {
  return (
    <section className="relative py-32">
      <div className="container">
        <div className="absolute inset-0 -z-10 size-full bg-[radial-gradient(hsl(from_var(--muted-foreground)_h_s_l)_1px,transparent_1px)] bg-size-[14px_14px] opacity-35"></div>
        <h1 className="text-5xl font-bold md:text-6xl lg:text-8xl">
          Simplifying maintenance for efficient code management.
        </h1>
        <div className="mt-8 flex flex-col-reverse gap-8 md:mt-10 md:flex-row md:items-center">
          <div className="flex flex-col gap-5">
            <Button className="sm:w-fit">
              Request early access <Globe className="ml-2 size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center -space-x-1">
                <Avatar className="size-6 border">
                  <AvatarImage
                    src="https://www.shadcnblocks.com/images/block/avatar-1.webp"
                    alt="placeholder"
                  />
                </Avatar>
                <Avatar className="size-6 border">
                  <AvatarImage
                    src="https://www.shadcnblocks.com/images/block/avatar-6.webp"
                    alt="placeholder"
                  />
                </Avatar>
                <Avatar className="size-6 border">
                  <AvatarImage
                    src="https://www.shadcnblocks.com/images/block/avatar-3.webp"
                    alt="placeholder"
                  />
                </Avatar>
              </span>
              <p className="text-xs">Trusted by 2000+ developers worldwide</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-lg text-xl">
            Our platform streamlines development by automating issue tracking, documentation, and
            knowledge management.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero53
