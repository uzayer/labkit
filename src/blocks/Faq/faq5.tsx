import RichText from '@/components/RichText'
import { Badge } from '@/components/ui/badge'
import { FaqBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Faq5: React.FC<FaqBlock & { publicContext: PublicContextProps }> = ({
  faqs,
  publicContext,
  headline,
  badge,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="text-center">
          {badge && <Badge className="text-xs font-medium">{badge}</Badge>}
          {headline && (
            <RichText
              publicContext={publicContext}
              content={headline}
              withWrapper={false}
              overrideStyle={{
                h1: 'mt-4 text-4xl font-semibold',
                h2: 'mt-4 text-3xl font-semibold',
                h3: 'mt-4 text-2xl font-semibold',
                h4: 'mt-4 text-1xl font-semibold',
                p: 'mt-6 font-medium text-muted-foreground',
              }}
            />
          )}
        </div>
        <div className="mx-auto mt-14 max-w-screen-sm">
          {faqs &&
            faqs.map((faq, index) => (
              <div key={index} className="mb-8 flex gap-4">
                <span className="bg-secondary text-primary flex size-6 shrink-0 items-center justify-center rounded-sm font-mono text-xs">
                  {index + 1}
                </span>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{faq.question}</h3>
                  </div>
                  {faq.answer && (
                    <RichText
                      publicContext={publicContext}
                      content={faq.answer}
                      overrideStyle={{
                        p: 'text-sm text-muted-foreground',
                        li: 'text-sm text-muted-foreground',
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default Faq5
