'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { WaitlistBlock } from '@/payload-types'
import type { Media as MediaType } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { RenderBlocks } from '@/blocks/RenderBlocks'

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          day: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hour: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minute: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          second: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ day: 0, hour: 0, minute: 0, second: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="mt-6 flex flex-col items-center gap-6">
      <div className="flex justify-center gap-6">
        {Object.entries(timeLeft).map(([key, value]) => (
          <React.Fragment key={`waitlist-timer-${key}`}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xl">{value}</span>
              <span className="text-muted-foreground text-xs uppercase">
                {key}
                {value > 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-muted-foreground last:hidden">:</span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="text-muted-foreground" size={14} />
        <span className="text-xs leading-0 uppercase">Time remaining until launch</span>
      </div>
    </div>
  )
}

const Waitlist2: React.FC<WaitlistBlock & { publicContext: PublicContextProps }> = ({
  headline,
  text1,
  label1,
  label2,
  label3,
  images,
  form,
  publicContext,
}) => {
  const logo = typeof images?.[0] === 'object' ? images[0] : null
  const avatarImages =
    images?.slice(1)?.filter((img): img is MediaType => typeof img === 'object') || []

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center gap-6">
            {logo && (
              <div className="bg-primary flex size-12 items-center justify-center rounded-2xl p-2">
                <Media resource={logo} imgClassName="size-full" />
              </div>
            )}
            {label2 && (
              <Badge variant="outline">
                <div className="relative flex items-center justify-center">
                  <span className="bg-primary size-1.5 rounded-full" />
                  <motion.span
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 1,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 0.5,
                    }}
                    className="bg-primary absolute size-1.5 rounded-full"
                  />
                </div>
                {label2}
              </Badge>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            {headline && (
              <RichText
                publicContext={publicContext}
                content={headline}
                withWrapper={false}
                overrideStyle={{
                  h3: 'text-center text-3xl font-medium lg:text-4xl',
                }}
              />
            )}
            {text1 && (
              <RichText
                publicContext={publicContext}
                content={text1}
                withWrapper={false}
                overrideStyle={{
                  p: 'text-muted-foreground max-w-md text-center',
                }}
              />
            )}
          </div>

          {form && form[0]?.form && (
            <div className="mt-8 w-full max-w-md">
              <RenderBlocks blocks={form} publicContext={publicContext} disableContainer />
            </div>
          )}

          {(avatarImages.length > 0 || label1) && (
            <div className="mt-4 flex items-center">
              <div className="relative flex flex-col items-center gap-2 md:flex-row md:gap-4">
                {avatarImages.length > 0 && (
                  <div className="flex items-center">
                    {avatarImages.map((avatar) => (
                      <div key={avatar.id} className="h-8 w-6">
                        <div className="size-8">
                          <Media
                            resource={avatar}
                            imgClassName="bg-background size-full shrink-0 rounded-full object-cover object-top p-0.5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {label1 && <p className="text-muted-foreground text-sm">{label1}</p>}
              </div>
            </div>
          )}

          {label3 && <CountdownTimer targetDate={label3} />}
        </div>
      </div>
    </section>
  )
}

export default Waitlist2
