import { BadgeCheck } from "lucide-react";
import React from "react";

import { CardStack } from "@/components/ui/card-stack";
import { cn } from "@/lib/utils";

interface Feature280Props {
  className?: string;
}

const Feature280 = ({ className }: Feature280Props) => {
  const features = [
    "Email: nsuhci.research@gmail.com",
    "Subject: DIAL Application – [Semester] – Your Name",
    "Attach your CV",
    "Include a short research interest statement",
    "Note your current program and year",
    "List any relevant skills or experience",
    "Shortlisted applicants contacted within 2 weeks",
    "No prior research experience required",
    "Open to NSU undergraduates and graduate students",
    "Positions filled on a rolling basis",
    "Recruitment window: Jan 1 – Jan 30, 2026",
    "Questions? Email us anytime",
  ];

  return (
    <section className={cn("h-full w-screen overflow-hidden py-32", className)}>
      <div className="container flex w-full max-w-6xl flex-col items-center justify-between lg:flex-row">
        <div className="relative flex h-full flex-col items-center justify-center gap-15 text-center lg:items-start lg:text-left">
          <h1 className="w-full max-w-md text-5xl font-medium font-semibold tracking-tighter lg:text-6xl">
            How to apply
          </h1>

          <div className="flex w-full max-w-lg items-center gap-4 px-5">
            <span className="h-px w-full bg-muted-foreground/20" />
            <p className="text-sm text-muted-foreground/50">FEATURES</p>
            <span className="h-px w-full bg-muted-foreground/20" />
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex gap-2 lg:items-center">
                <BadgeCheck className="size-4 text-muted-foreground/80" />
                <p className="tracking-tight text-muted-foreground/80">
                  {feature}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-24 flex items-center justify-center lg:mt-0">
          <CardStack items={CARDS} />
        </div>
      </div>
    </section>
  );
};

export { Feature280 };

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-emerald-100 px-1 py-0.5 font-bold text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500",
        className,
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Antara Saha",
    designation: "Graduate RA, DIAL",
    content: (
      <p>
        I joined with no formal research experience. Within a semester I was{" "}
        <Highlight>co-authoring a paper for CHI</Highlight>. The mentorship here
        is unlike anything else at NSU.
      </p>
    ),
  },
  {
    id: 1,
    name: "Mahir Morshed",
    designation: "Undergraduate RA, DIAL",
    content: (
      <p>
        Field research changed how I think about technology.{" "}
        <Highlight>We work with real communities</Highlight> in Bangladesh — not
        hypothetical users in a lab.
      </p>
    ),
  },
  {
    id: 2,
    name: "Lamia Amin",
    designation: "Undergraduate RA, DIAL",
    content: (
      <p>
        DIAL is a small lab so you are never lost in the crowd.{" "}
        <Highlight>Nova gives you real feedback</Highlight> and real
        responsibility from day one.
      </p>
    ),
  },
];
