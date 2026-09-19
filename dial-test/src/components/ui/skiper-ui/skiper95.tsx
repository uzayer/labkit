"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import React from "react";

const Skiper95 = () => {
  const { scrollYProgress } = useScroll();

  const value = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 0 ${value}% 0)`;

  const progressValue = useTransform(scrollYProgress, [0, 1], [1, 100]);

  const y = useTransform(scrollYProgress, [0, 1], [0, 190]);

  return (
    <div className="relative flex h-full w-full">
      <div className="z-4 sticky left-0 top-1/2 flex h-48 w-4 -translate-y-1/2 translate-x-10 flex-col items-center justify-center">
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, var(--foreground) 0, var(--foreground) 1px, transparent 1px, transparent 5px)`,
              opacity: 0.15,
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath,
              backgroundImage: `repeating-linear-gradient(to bottom, var(--foreground) 0, var(--foreground) 1px, transparent 1px, transparent 5px)`,
            }}
          />
        </div>
        <motion.div
          style={{ y }}
          className="bg-foreground text-foreground absolute left-0 top-0 flex h-px w-8 items-center justify-center text-sm font-medium tracking-tight"
        >
          <motion.span className="absolute -right-1 translate-x-full tabular-nums">
            {useTransform(progressValue, (v) => Math.round(v))}
          </motion.span>
        </motion.div>
      </div>

      <Content />
    </div>
  );
};

export { Skiper95 };

/**
 * ==============   Utils   ================
 */

function Content() {
  return (
    <article className="mx-auto max-w-xl space-y-[10vh] py-[50vh]">
      <div className="-mt-36 mb-36 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Scroll down to see the effect
        </span>
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="text-justify">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi alias
          similique eveniet corrupti cupiditate, saepe magni, distinctio at
          dolor dignissimos consequatur rerum quasi expedita soluta amet, fugiat
          quaerat commodi accusamus enim necessitatibus facere cumque dolores
          quisquam? Vero harum repellendus labore.
        </div>
      ))}
    </article>
  );
}
