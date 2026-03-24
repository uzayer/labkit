import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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

const FAQ3: React.FC<FaqBlock> = () => {
  return (
    <section className="py-32">
      <div className="container space-y-16">
        <div className="flex flex-col items-start text-left lg:items-center lg:text-center">
          <h2 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground max-w-3xl lg:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat
            omnis!
          </p>
        </div>
        <Accordion type="single" collapsible className="mx-auto w-full lg:max-w-3xl">
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
        <div className="bg-accent flex w-full flex-col items-center rounded-lg p-4 text-center md:rounded-xl md:p-6 lg:p-8">
          <div className="relative">
            <Avatar className="absolute mb-4 size-16 origin-bottom -translate-x-[60%] scale-[80%] border md:mb-5">
              <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-2.webp" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar className="absolute mb-4 size-16 origin-bottom translate-x-[60%] scale-[80%] border md:mb-5">
              <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-3.webp" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar className="mb-4 size-16 border md:mb-5">
              <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-1.webp" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
          </div>
          <h3 className="mb-2 max-w-3xl font-semibold lg:text-lg">Need more support?</h3>
          <p className="text-muted-foreground mb-8 max-w-3xl lg:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat
            omnis!
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto">Call us</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ3
