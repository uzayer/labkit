'use client'

import type { MotionTextBlock as MotionTextBlockProps } from 'src/payload-types'
import { motion } from 'framer-motion'
import { cn } from 'src/utilities/cn'
import React, { createElement } from 'react'
import { PublicContextProps } from '@/utilities/publicContextProps'

type Props = {
  className?: string
  overrideStyles?: Record<string, string>
} & MotionTextBlockProps

export const MotionTextBlock: React.FC<Props & { publicContext: PublicContextProps }> = ({
  className,
  textLevel = 'h1',
  prefix,
  animatedWords,
  suffix,
  animationDelay = 0.08,
  animationDuration = 0.8,
  publicContext,
  overrideStyles,
}) => {
  if (!animatedWords || animatedWords.length === 0) {
    return null
  }

  const textTag = textLevel || 'h1'
  const textStyles = overrideStyles?.[textTag] || ''

  return createElement(
    textTag,
    { className: cn('inline-block', className, textStyles) },
    <>
      {prefix && `${prefix} `}
      <span
        className="overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '600px',
        }}
      >
        {animatedWords.map((wordData, i) => (
          <motion.span
            className="relative inline-block px-[6px] leading-[none]"
            key={i}
            initial={{
              opacity: 0,
              y: '70%',
              rotateX: '-28deg',
            }}
            animate={{
              opacity: 1,
              y: '0%',
              rotateX: '0deg',
            }}
            transition={{
              delay: i * (animationDelay || 0.08) + 0.1,
              duration: animationDuration || undefined,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {wordData.isHighlighted ? (
              <span className={wordData.highlightClass || 'font-playfair'}>{wordData.word}</span>
            ) : (
              wordData.word
            )}
          </motion.span>
        ))}
      </span>
      {suffix && ` ${suffix}`}
    </>,
  )
}
