import { CMSLink } from '@/components/Link'
import { Separator } from '@/components/ui/separator'
import type { CtaBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

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
              <CMSLink publicContext={publicContext} {...links[0].link} size="lg" />
            )}
            <Separator className="shrink" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cta20
