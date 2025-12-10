import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FaqBlock } from '@/payload-types'

const data = [
  {
    id: 'faq-1',
    question: 'Can it do X?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.',
  },
  {
    id: 'faq-2',
    question: 'Can it do Y?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.',
  },
  {
    id: 'faq-3',
    question: 'Can it do Z?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.',
  },
  {
    id: 'faq-4',
    question: 'Can it do X?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.',
  },
  {
    id: 'faq-5',
    question: 'Can it do Y?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.',
  },
  {
    id: 'faq-6',
    question: 'Can it do Z?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.',
  },
  {
    id: 'faq-7',
    question: 'Can it do X?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.',
  },
]

const FAQ2: React.FC<FaqBlock> = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-start text-left">
          <h2 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            Frequently asked questions
          </h2>
        </div>
        <Accordion type="single" collapsible>
          {data.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">{item.question}</div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground lg:text-lg">{item.answer}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ2
