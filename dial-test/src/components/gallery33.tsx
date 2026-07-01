"use client";

import { ArrowRightIcon, HeartIcon } from "lucide-react";
import React, { useState } from "react";

import { Lens } from "@/components/ui/lens";
import { cn } from "@/lib/utils";

interface CardData {
  title: string;
  price: string;
  image: string;
  link: string;
}

const Gallery33 = ({
  cardData = [
    {
      title: "Dhaka, 2024",
      price: "Lab sessions",
      image: "https://picsum.photos/seed/dial-lab/800/600",
      link: "#",
    },
    {
      title: "Rajshahi field visit, 2025",
      price: "Fieldwork",
      image: "https://picsum.photos/seed/dial-field/800/600",
      link: "#",
    },
    {
      title: "Every Ramadan",
      price: "Iftar together",
      image: "https://picsum.photos/seed/dial-iftar/800/600",
      link: "#",
    },
    {
      title: "CHI 2024, Honolulu",
      price: "Conference trip",
      image: "https://picsum.photos/seed/dial-chi/800/600",
      link: "#",
    },
    {
      title: "July Movement, 2024",
      price: "Solidarity",
      image: "https://picsum.photos/seed/dial-july/800/600",
      link: "#",
    },
    {
      title: "NSU, Dhaka",
      price: "Research presentations",
      image: "https://picsum.photos/seed/dial-present/800/600",
      link: "#",
    },
  ],
  className,
}: {
  cardData?: CardData[];
  className?: string;
}) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className={cn("overflow-hidden py-32", className)}>
      <div className="container w-full">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="relative flex flex-col rounded-4xl bg-muted/60 p-2"
            >
              <Lens
                hovering={hoveredCard === index}
                setHovering={(hovering) =>
                  setHoveredCard(hovering ? index : null)
                }
              >
                <img
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  src={card.image}
                  alt={card.title}
                  className="h-72 w-full rounded-3xl object-cover"
                />
              </Lens>
              <div className="mt-3 flex items-center justify-between gap-3 px-2 pb-3">
                <div>
                  <p className="text-sm tracking-tighter text-muted-foreground">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {card.price}
                  </h3>
                </div>
                <a
                  href={card.link}
                  className="flex size-12 items-center justify-center gap-2 rounded-full bg-muted-foreground/10 text-sm transition-all duration-300 hover:bg-muted-foreground/20"
                >
                  <ArrowRightIcon className="size-7 -rotate-45 stroke-1" />
                </a>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <div className="flex size-12 items-center justify-center gap-2 rounded-full bg-background/30 text-sm text-background transition-all duration-300 hover:bg-background/50">
                  <HeartIcon className="size-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery33 };
