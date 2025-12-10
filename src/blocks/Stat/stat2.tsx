import { Card } from '@/components/ui/card'
import { StatBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'
import { Icon } from '@/components/Icon'

const getIconColor = (iconColor: string) => {
  switch (iconColor) {
    case 'green':
      return 'text-green-400'
    case 'red':
      return 'text-red-400'
    default:
      return 'text-black'
  }
}

const Stat2: React.FC<StatBlock & { publicContext: PublicContextProps }> = ({
  headline,
  stats,
  publicContext,
}) => {
  if (!stats) return null

  return (
    <section className="py-32">
      <div className="container">
        {headline && (
          <RichText
            publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h1: 'text-center text-4xl font-semibold lg:text-6xl',
              h2: 'text-center text-3xl font-semibold lg:text-5xl',
              h3: 'text-center text-2xl font-semibold lg:text-4xl',
              h4: 'text-center text-1xl font-semibold lg:text-3xl',
              p: 'text-center text-muted-foreground',
            }}
          />
        )}
        <div className="grid gap-6 pt-9 text-center md:grid-cols-3 lg:pt-20">
          {stats?.map(({ icon, iconColor, counter, description, id }) => (
            <Card key={id} className="bg-accent border-none p-8 lg:p-10">
              <div className="mb-8 flex items-center justify-center gap-2 text-2xl font-semibold lg:text-3xl">
                {icon && iconColor && (
                  <Icon icon={icon} className={`size-8 shrink-1 ${getIconColor(iconColor)}`} />
                )}
                {counter}
              </div>
              {description && (
                <RichText
                  publicContext={publicContext}
                  content={description}
                  withWrapper={false}
                  overrideStyle={{
                    h2: 'text-muted-foreground text-base line-clamp-3',
                    h3: 'text-muted-foreground text-base line-clamp-3',
                    h4: 'text-muted-foreground text-base line-clamp-3',
                    p: 'text-muted-foreground text-base line-clamp-3',
                  }}
                />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stat2
