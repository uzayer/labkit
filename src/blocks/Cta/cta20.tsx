import { CMSLink } from '@/components/Link'
import type { CtaBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Separator } from '@/components/ui/separator'

const Cta20: React.FC<CtaBlock & { publicContext: PublicContextProps }> = ({
  tagline,
  links,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div>
          {tagline && <p className="text-center text-sm">{tagline}</p>}
          <div className="mt-4 flex items-center justify-between gap-4">
            <Separator className="shrink" />
            {links?.[0]?.link && (
              <CMSLink {...links[0].link} publicContext={publicContext} size="lg" />
            )}
            <Separator className="shrink" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cta20
