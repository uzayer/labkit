"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { eyebrow } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface Logos12Props {
  /** Organization names, in display order (see `homePartnerOrganizations`). */
  partners: string[];
  className?: string;
}

const Logos12 = ({ partners, className }: Logos12Props) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => setReduceMotion(mediaQuery.matches);
    handleChange();

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Text wordmarks until DIAL supplies real logo files — the placeholder SVGs
  // showed fictional brands under real organisations' alt text. The names come
  // from Organization records; "in collaboration with" still needs the Lab's
  // confirmation before launch.
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <p className={cn(eyebrow, "text-center")}>In collaboration with</p>
        <div className="relative mx-auto flex items-center justify-center pt-8">
          <Carousel
            opts={{ loop: true }}
            plugins={
              reduceMotion
                ? []
                : [
                    AutoScroll({
                      playOnInit: true,
                      stopOnInteraction: false,
                      stopOnMouseEnter: true,
                    }),
                  ]
            }
          >
            <CarouselContent className="ml-0">
              {partners.map((name) => (
                <CarouselItem
                  key={name}
                  className="relative mx-4 flex h-25 basis-1/2 justify-center border-y border-border pl-0 sm:basis-1/3 lg:basis-1/5"
                >
                  <div className="flex items-center justify-center text-center lg:mx-6">
                    <span className="text-base font-semibold tracking-tight text-balance text-muted-foreground md:text-lg">
                      {name}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div aria-hidden className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent"></div>
          <div aria-hidden className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export { Logos12 };
