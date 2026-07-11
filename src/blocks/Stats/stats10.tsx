import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Icon } from '@/components/Icon'
import { StatsBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Stats10: React.FC<StatsBlock & { publicContext: PublicContextProps }> = ({
  headline,
  stats10Cards,
  gridColumns = '3',
  publicContext,
}) => {
  const gridColsClass =
    {
      '2': 'lg:grid-cols-2',
      '3': 'lg:grid-cols-3',
      '4': 'lg:grid-cols-4',
    }[gridColumns as string] || 'lg:grid-cols-3'

  return (
    <section className="py-12 md:py-20">
      <div className="container max-w-[75rem]">
        {headline && (
          <RichText
            publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h1: 'text-center text-4xl font-semibold lg:text-6xl mb-10',
              h2: 'text-center text-3xl font-semibold lg:text-5xl mb-10',
              h3: 'text-center text-2xl font-semibold lg:text-4xl mb-10',
            }}
          />
        )}
        <div className="pt-10 pb-10">
          <div className={`grid grid-cols-1 gap-7 md:grid-cols-2 ${gridColsClass}`}>
            {stats10Cards?.map((card, i) => (
              <div key={i} className="block w-full">
                <Card className="rounded-3xl border-2 transition hover:-translate-y-3 hover:border-primary">
                  <CardContent className="block p-10">
                    <div className="flex items-center gap-7">
                      {card.avatarIcon && (
                        <Avatar className="h-14 w-14 overflow-hidden rounded-full border">
                          <AvatarFallback className="flex items-center justify-center border-0 bg-transparent">
                            <Icon icon={card.avatarIcon} size={28} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {card.logo && typeof card.logo === 'object' && (
                        <Media resource={card.logo} imgClassName="h-6" />
                      )}
                    </div>
                    <div className="mt-6 text-6xl leading-tight font-semibold">{card.heading}</div>
                    <p className="mb-5 max-w-52 text-lg font-medium">{card.text}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats10
