import { Bolt, Cloud, Star } from 'lucide-react'

const features = [
  {
    id: 'feature-1',
    title: 'Feature 1',
    description:
      'Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa consectetur, id interdum ante congue.',
    icon: Cloud,
  },
  {
    id: 'feature-2',
    title: 'Feature 2',
    description:
      'Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa consectetur, id interdum ante congue.',
    icon: Star,
  },
  {
    id: 'feature-3',
    title: 'Feature 3',
    description:
      'Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa consectetur, id interdum ante congue.',
    icon: Bolt,
  },
]

const Feature58 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="border-border bg-accent grid gap-x-20 rounded-lg border p-6 md:grid-cols-2 md:p-8 lg:p-16">
          <div className="mb-8 flex justify-center lg:justify-start xl:mb-0">
            <div className="relative aspect-6/5 h-min w-full max-w-63 md:max-w-67 xl:max-w-sm">
              <img
                src="https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg"
                alt="placeholder"
                className="size-full rounded-md object-cover object-center"
              />
            </div>
          </div>
          <ul className="flex flex-col justify-center gap-y-8">
            {features.map((feature) => (
              <li key={feature.id} className="flex">
                <feature.icon className="mr-3 size-5 shrink-0 lg:mr-6 lg:size-6" />
                <div>
                  <div className="text-accent-foreground mb-3 h-5 text-sm font-semibold md:text-base">
                    {feature.title}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium md:text-base">
                    {feature.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Feature58
