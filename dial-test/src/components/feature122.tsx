"use client";

import {
  Accessibility,
  ArrowRight,
  Brain,
  Globe,
  Heart,
  Users,
} from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataBlockProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

interface Feature122Props {
  className?: string;
}

const Feature122 = ({ className }: Feature122Props) => {
  return (
    <section className={cn("container py-32", className)}>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-3">
        <DataBlock
          title="Accessibility & Inclusion"
          description="Designing technology for marginalised communities in resource-constrained settings."
          href="/research/accessibility-inclusion"
          icon={<Accessibility className="size-10 text-primary/90 md:size-12" strokeWidth={1.5} />}
        />
        <DataBlock
          title="Gender & Feminist HCI"
          description="Feminist approaches to HCI: safety, dignity, and equity in digital life."
          href="/research/gender-feminist-hci"
          icon={<Users className="size-10 text-primary/90 md:size-12" strokeWidth={1.5} />}
        />
        <DataBlock
          title="Mental Health & Wellbeing"
          description="Detection and interventions built for low-resource contexts and local realities."
          href="/research/mental-health-wellbeing"
          icon={<Heart className="size-10 text-primary/90 md:size-12" strokeWidth={1.5} />}
        />
        <DataBlock
          title="Explainable AI & ML"
          description="Making ML systems interpretable and trustworthy in the Global South context."
          href="/research/explainable-ai-ml"
          icon={<Brain className="size-10 text-primary/90 md:size-12" strokeWidth={1.5} />}
        />
        <DataBlock
          title="ICT for Development (ICTD)"
          description="Technology that meets people where they are—language, literacy, devices, and trust."
          href="/research/ictd"
          icon={<Globe className="size-10 text-primary/90 md:size-12" strokeWidth={1.5} />}
        />
        <div className="flex w-full grow flex-col gap-6 rounded-lg bg-accent/80 p-6 transition-all hover:bg-accent md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-2 lg:p-10">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <h3 className="max-w-[85%] text-xl font-bold tracking-tight md:max-w-[60%] lg:text-3xl">
              Explore our research
            </h3>
            <Button asChild className="w-full sm:w-auto" size="lg">
              <a href="/research">View all</a>
            </Button>
          </div>
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg"
            alt="DIAL team"
            className="aspect-square h-full w-full rounded-lg object-cover md:aspect-[3]"
          />
        </div>
      </div>
    </section>
  );
};

export { Feature122 };

const DataBlock: React.FC<DataBlockProps> = ({
  title,
  description,
  icon,
  href,
}) => {
  const [isBlockHover, setBlockHover] = useState<boolean>(false);

  return (
    <a
      href={href}
      className="flex w-full cursor-pointer flex-col rounded-lg bg-accent/80 p-6 transition-all hover:bg-accent lg:p-8"
      onMouseOver={() => setBlockHover(true)}
      onMouseOut={() => setBlockHover(false)}
    >
      <h3
        className={`mb-3 w-fit border-b border-solid border-transparent text-lg font-bold tracking-tight transition lg:text-xl ${isBlockHover && "border-primary/80!"}`}
      >
        {title}
      </h3>
      <p className="mb-5 text-sm text-muted-foreground/90 lg:text-base">
        {description}
      </p>
      <div className="mt-auto flex items-end justify-between">
        <div>{icon}</div>
        <ArrowRight
          className={`size-5 h-fit text-primary/80 transition-all ${isBlockHover && "translate-x-1.5 transform"}`}
          strokeWidth={1.5}
        />
      </div>
    </a>
  );
};
