"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Logos12Props {
  className?: string;
}

const Logos12 = ({ className }: Logos12Props) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => setReduceMotion(mediaQuery.matches);
    handleChange();

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const logos = [
    {
      id: "logo-1",
      description: "North South University",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
      className: "h-7 w-auto opacity-70 grayscale dark:invert",
    },
    {
      id: "logo-2",
      description: "Google",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
      className: "h-7 w-auto opacity-70 grayscale dark:invert",
    },
    {
      id: "logo-3",
      description: "Bill & Melinda Gates Foundation",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
      className: "h-7 w-auto opacity-70 grayscale dark:invert",
    },
    {
      id: "logo-4",
      description: "ACM SIGCHI",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
      className: "h-7 w-auto opacity-70 grayscale dark:invert",
    },
    {
      id: "logo-5",
      description: "Cardiff University",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
      className: "h-7 w-auto opacity-70 grayscale dark:invert",
    },
    {
      id: "logo-6",
      description: "Microsoft Research",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
      className: "h-5 w-auto opacity-70 grayscale dark:invert",
    },
    {
      id: "logo-7",
      description: "University of Washington",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
      className: "h-7 w-auto opacity-70 grayscale dark:invert",
    },
    {
      id: "logo-8",
      description: "BRAC University",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg",
      className: "h-7 w-auto opacity-70 grayscale dark:invert",
    },
  ];

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="text-center text-sm font-medium text-muted-foreground">
          In collaboration with
        </div>
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
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="relative mx-4 flex h-25 basis-1/2 justify-center border-y border-border pl-0 sm:basis-1/4 md:basis-1/3 lg:basis-1/7"
                >
                  <div className="flex flex-col items-center justify-center lg:mx-10">
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export { Logos12 };
