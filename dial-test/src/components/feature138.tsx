"use client";

import { ArrowRight, MoveRight, Trophy } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpotlightProject {
  localName: string;
  title: string;
  abstract: string;
  description: string;
  keywords: string[];
  award?: string;
  teamSize: number;
  pubCount: number;
  href: string;
  image: string;
}

const projects: SpotlightProject[] = [
  {
    localName: "প্রতিবাদী",
    title: "Protibadi",
    abstract:
      "A wearable and middleware stack for real-time personal safety support, built with and for women navigating harassment in Bangladesh.",
    description:
      "Long-running, activism-oriented research rooted in the CHI and CSCW communities. Protibadi combines wearable sensors, a companion app, and a community network to let women document, share, and respond to harassment incidents — built through sustained co-design with at-risk women in Dhaka.",
    keywords: ["Safety & Security", "Gender & Feminist HCI", "Co-design", "Wearables"],
    award: "Best of CHI · 2019",
    teamSize: 6,
    pubCount: 6,
    href: "/projects/protibadi",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
  },
  {
    localName: "অপরাজিতা",
    title: "Aparajita",
    abstract:
      "Women-in-computing and financial inclusion research using co-design and fictional inquiry. Gates Foundation–funded work.",
    description:
      "Explores the barriers preventing women from entering and thriving in technology and digital finance in Bangladesh. Uses speculative design and fictional futures workshops to surface hidden constraints. Gates Foundation–funded, with findings influencing national digital literacy policy.",
    keywords: ["Accessibility & Inclusion", "Gender & Feminist HCI", "ICTD", "Financial Inclusion"],
    teamSize: 5,
    pubCount: 5,
    href: "/projects/aparajita",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-2.svg",
  },
  {
    localName: "মন মাঝি",
    title: "Mon Majhi",
    abstract:
      "Real-time, explainable ML approaches to detecting depression and stress from passive smartphone behaviour — without surveys or self-report.",
    description:
      "Built for low-resource clinical contexts in Bangladesh, Mon Majhi uses passive sensing of phone usage patterns to detect psychological stress and depression — no questionnaires required. The system's explainability layer surfaces human-readable reasons for its assessments, supporting clinician review.",
    keywords: ["Mental Health & Wellbeing", "Explainable AI", "Passive Sensing", "ML"],
    teamSize: 4,
    pubCount: 4,
    href: "/projects/monmajhi",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-3.svg",
  },
];

interface Feature138Props {
  className?: string;
}

const Feature138 = ({ className }: Feature138Props) => {
  const [openProject, setOpenProject] = useState<SpotlightProject | null>(null);
  const [stableProject, setStableProject] = useState<SpotlightProject | null>(null);

  function openDialog(project: SpotlightProject) {
    setStableProject(project);
    setOpenProject(project);
  }

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <h2 className="text-4xl font-semibold">Spotlight Projects</h2>
        <p className="mt-3 text-xl font-medium text-muted-foreground">
          Work that could only have come from DIAL
        </p>

        {projects.map((project, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <div
              key={project.title}
              className={cn(
                "mt-16 flex flex-col overflow-hidden rounded-2xl bg-muted",
                "md:flex-row",
                !imageLeft && "md:flex-row-reverse",
              )}
            >
              <div className="flex w-full items-center bg-muted md:w-1/2">
                <img
                  src={project.image}
                  alt={project.title}
                  className="max-h-64 w-full object-cover"
                />
              </div>
              <div className="flex w-full flex-col justify-center gap-6 px-8 py-7 md:w-1/2 md:px-12 md:py-10">
                <h6 className="text-lg font-semibold md:text-2xl">
                  {project.localName} · {project.title}
                </h6>
                <div className="h-px w-full bg-muted-foreground" />
                <p className="text-muted-foreground">{project.abstract}</p>
                <button
                  className="inline-flex items-center font-medium hover:underline"
                  onClick={() => openDialog(project)}
                >
                  <span>Learn more</span>
                  <MoveRight strokeWidth={2} className="ml-2 size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project quick-view dialog */}
      <Dialog open={openProject !== null} onOpenChange={(open) => { if (!open) setOpenProject(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              {stableProject?.localName} · {stableProject?.title}
            </DialogTitle>
            {stableProject?.award && (
              <DialogDescription>
                <Badge
                  variant="outline"
                  className="border-amber-400/40 bg-amber-50 text-xs text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                >
                  <Trophy className="mr-1 size-3" />
                  {stableProject.award}
                </Badge>
              </DialogDescription>
            )}
          </DialogHeader>

          <p className="text-sm text-muted-foreground">{stableProject?.description}</p>

          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold">{stableProject?.pubCount}</p>
              <p className="text-xs text-muted-foreground">Publications</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stableProject?.teamSize}</p>
              <p className="text-xs text-muted-foreground">Team members</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {stableProject?.keywords.map((kw) => (
              <Badge key={kw} variant="outline" className="text-xs">
                {kw}
              </Badge>
            ))}
          </div>

          <DialogFooter showCloseButton>
            <a href={stableProject?.href ?? "#"} onClick={() => setOpenProject(null)}>
              <Button size="sm">
                Go to project
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export { Feature138 };
