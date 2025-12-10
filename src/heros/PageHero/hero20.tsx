'use client'

import Fade from 'embla-carousel-fade'
import { CopyCheck, DollarSign, MessagesSquare } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const DURATION = 8000

const accordions = [
  {
    id: '1',
    question: 'Can I use this for commercial projects?',
    icon: <CopyCheck className="w-5" />,
    answer: 'Yes, All blocks are yours to use.',
    image: '/images/block/placeholder-4.svg',
  },
  {
    id: '2',
    question: 'Are there any hidden fees?',
    icon: <DollarSign className="w-5" />,
    answer: 'No, there are no hidden fees.',
    image: '/images/block/placeholder-2.svg',
  },
  {
    id: '3',
    question: 'Do you provide support?',
    icon: <MessagesSquare className="w-5" />,
    answer: 'Yes, we provide support via email.',
    image: '/images/block/placeholder-5.svg',
  },
]

const Hero20 = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [currentAccordion, setCurrentAccordion] = useState('1')

  useEffect(() => {
    api?.scrollTo(+currentAccordion - 1)
    const interval = setInterval(() => {
      setCurrentAccordion((prev) => {
        const next = parseInt(prev) + 1
        return next > 3 ? '1' : next.toString()
      })
    }, DURATION)

    return () => clearInterval(interval)
  }, [api, currentAccordion])

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto grid max-w-screen-lg gap-20 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4">
              Platform
            </Badge>
            <h1 className="mb-8 text-3xl font-medium lg:text-5xl">Build your own platform</h1>
            <Accordion
              type="single"
              value={currentAccordion}
              onValueChange={(value) => {
                setCurrentAccordion(value)
                api?.scrollTo(+value - 1)
              }}
            >
              {accordions.map((accordion) => (
                <AccordionItem key={accordion.id} value={accordion.id} className="border-b-0">
                  <AccordionTrigger className="data-[state=closed]:text-muted-foreground text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-muted flex size-9 items-center justify-center rounded-lg">
                        {accordion.icon}
                      </span>
                      <span className="font-medium lg:text-lg">{accordion.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground lg:text-base">
                    {accordion.answer}
                    <div className="bg-muted mt-8 h-px">
                      <div
                        className={'animate-progress bg-primary h-px'}
                        style={{
                          animationDuration: `${DURATION}ms`,
                        }}
                      ></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <Carousel
              opts={{
                duration: 50,
              }}
              setApi={setApi}
              plugins={[Fade()]}
            >
              <CarouselContent>
                {accordions.map((accordion) => (
                  <CarouselItem key={accordion.id}>
                    <div>
                      <img
                        src={accordion.image}
                        alt="placeholder"
                        className="max-h-96 w-full object-cover lg:max-h-none"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero20
