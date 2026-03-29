import { Icon } from '@/components/Icon'
import type { TrustStripBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const TrustStrip1: React.FC<TrustStripBlock & { publicContext: PublicContextProps }> = ({
  items,
}) => {
  return (
    <section className="bg-muted/30 border-y py-6">
      <div className="container">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {Array.isArray(items) &&
            items.length > 0 &&
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                  {item.icon && <Icon icon={item.icon} size={20} />}
                </div>
                <div>
                  {item.title && <p className="leading-tight font-medium">{item.title}</p>}
                  {item.description && (
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default TrustStrip1
