import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const Hero55 = () => {
  return (
    <section className="relative py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-10 text-center">
          <a
            href="#"
            className="hover:bg-muted flex items-center gap-2 rounded-full px-2 py-1 text-sm transition-colors"
          >
            <Badge>7 days ago</Badge>
            Slack integration is here!
            <ArrowRight className="h-auto w-4" />
          </a>
          <h1 className="text-4xl font-semibold lg:text-8xl">
            Manage design work right from the canvas
          </h1>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button size="lg">Get started - it&apos;s free</Button>
            <Button size="lg" variant="outline">
              Book a demo
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[50%_0] bg-[url('/images/block/shadow-overlay.png')] bg-no-repeat"></div>
    </section>
  )
}

export default Hero55
