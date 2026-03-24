import { ChevronRight } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FaqBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Faq4: React.FC<FaqBlock & { publicContext: PublicContextProps }> = ({
  headline,
  badge,
  faqs,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div>
          <Badge className="text-xs font-medium">{badge}</Badge>
          {headline && (
            <RichText
              publicContext={publicContext}
              content={headline}
              overrideStyle={{
                h1: 'mt-4 text-4xl font-semibold',
                h2: 'mt-4 text-4xl font-semibold',
                h3: 'mt-4 text-2xl font-semibold',
                p: 'mt-6 font-medium text-muted-foreground',
              }}
            />
          )}
        </div>
        <div className="mt-12">
          <Accordion type="single" collapsible>
            {faqs?.map(({ question, answer, id }, index) => (
              <AccordionItem key={id} value={`item-${index}`} className="border-b-0">
                <AccordionTrigger className="hover:text-foreground/60 text-left hover:no-underline">
                  {question}
                </AccordionTrigger>
                {answer && (
                  <AccordionContent>
                    <RichText
                      publicContext={publicContext}
                      content={answer}
                      overrideStyle={{
                        p: '',
                        li: '',
                      }}
                      withWrapper={false}
                    />
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <Separator className="my-12" />
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
          <div className="lg:col-span-2">
            <h1 className="mt-4 text-2xl font-semibold">Still have questions?</h1>
            <p className="text-muted-foreground mt-6 font-medium">
              We&apos;re here to provide clarity and assist with any queries you may have.
            </p>
          </div>
          <div className="flex md:justify-end">
            <a href="#" className="flex items-center gap-2 hover:underline">
              Contact Support
              <ChevronRight className="h-auto w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Faq4
