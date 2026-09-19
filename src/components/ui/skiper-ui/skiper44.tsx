'use client'

import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react'
import React, { useRef } from 'react'

const Skiper44 = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: containerProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(containerProgress, [0.2, 1], [1, 0.5])
  const blur = useTransform(containerProgress, [0.2, 0.8], [0, 20])
  const scaleDiv = useTransform(containerProgress, [0, 0.3], [0.98, 1])

  return (
    <div className="font-geist flex w-screen flex-col items-center overflow-x-clip bg-[#f5f4f3] pt-[50vh] text-black">
      <motion.div
        style={{
          scale: scale,
        }}
        className="sticky top-[10%] flex gap-2 pb-10 text-2xl font-bold tracking-tighter md:text-5xl"
      >
        <div className="sticky top-[50%] h-fit">
          <h1>We Design</h1>
          <div className="absolute top-0 left-full z-10 h-[40vh] w-screen -translate-y-full bg-[#f5f4f3]/90" />
          <div className="absolute bottom-0 left-full z-10 h-[44vh] w-screen translate-y-full bg-[#f5f4f3]/90" />
        </div>
        <div className="h-fit space-y-2">
          <h2 className="">the Skiper platform</h2>
          <h2 className="">Skiper Design System</h2>
          <h2 className="">the Skiper library </h2>
          <h2 className="">the Skiper brand</h2>
          <h2 className="">Skiper Conf</h2>
          <h2 className="">the Skiper platform</h2>
          <h2 className="">Skiper Ship</h2>
        </div>
        <motion.div
          style={{
            backdropFilter: useMotionTemplate`blur(${blur}px)`,
          }}
          className="absolute inset-0 bg-white/10"
        />
      </motion.div>
      <motion.div
        ref={containerRef}
        style={{
          scale: scaleDiv,
        }}
        className="z-20 mt-[20vh] flex w-full flex-col items-center space-y-20 rounded-4xl bg-[#121212] py-[20vh] font-medium tracking-tight text-white"
      >
        <div className="grid w-full max-w-sm grid-cols-2 gap-5">
          <p className="text-right opacity-30">Brand Design</p>
          <ul>
            {Names.slice(0, 5).map((name, index) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        <div className="grid w-full max-w-sm grid-cols-2 gap-5">
          <p className="text-right opacity-30">Design Engineers</p>
          <ul>
            {Names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export { Skiper44 }

const Names = [
  'Gurvinder Singh',
  'Not gxuri ',
  'Jane Smith',
  'Emily Chen',
  'Carlos Ramirez',
  'Ava Patel',
  "Liam O'Brien",
  'Sophia Müller',
  'Noah Kim',
  'Mia Rossi',
  'Lucas Silva',
  'Olivia Dubois',
  'Ethan Zhang',
  'Chloe Ivanova',
  'Mateo Garcia',
  'Isabella Rossi',
  'William Lee',
  'Zara Ahmed',
  'Benjamin Cohen',
  'Hana Suzuki',
]

/**
 * Skiper 44 ScrollAnimation_006 — React + framer motion
 * Inspired by and adapted from https://nextjs.org/
 * Inspired by and adapted from https://devouringdetails.com/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the nextjs.org . They’re independent recreations meant to study interaction design
 * These animations aren’t associated with the devouringdetails.com . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
