"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FeatureArea {
  title: string;
  slug: string;
  image: string;
  tagline: string;
  description: string;
  keywords: string[];
  projectCount: number;
  pubCount: number;
}

/** A Research Theme as the page supplies it: record title and derived counts. */
export interface Feature199Theme {
  slug: string;
  title: string;
  projectCount: number;
  pubCount: number;
}

// Prose per theme (tagline, description, keywords) and placeholder images,
// keyed by slug. Titles and counts come from the records via props.
const AREA_COPY: Omit<FeatureArea, "projectCount" | "pubCount">[] = [
  {
    title: "Accessibility & Inclusion",
    slug: "accessibility-inclusion",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    tagline: "Technology for users mainstream design leaves behind.",
    description:
      "DIAL investigates how people with disabilities, low literacy, and other barriers navigate technology — and designs systems that include them rather than assume them away. Work spans assistive technology for visually impaired people, low-cost wearables for stroke rehabilitation, and tools for children with autism and their caregivers.",
    keywords: ["Autism", "Visual Impairment", "Stroke Rehab"],
  },
  {
    title: "Gender & Feminist HCI",
    slug: "gender-feminist-hci",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
    tagline: "Centring safety, agency, and power in technology design.",
    description:
      "Research on online harassment, digital safety, and women's experiences with technology in South Asia. Projects use participatory design and feminist theory to build systems that centre women's safety and agency.",
    keywords: ["Online Safety", "Gender", "Co-design"],
  },
  {
    title: "Mental Health & Wellbeing",
    slug: "mental-health-wellbeing",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
    tagline: "Passive sensing and peer support for low-resource mental health contexts.",
    description:
      "Digital tools and platforms for mental health support built for contexts where clinical infrastructure is limited. Projects use passive smartphone sensing, peer networks, and co-design with students and practitioners.",
    keywords: ["Mental Health", "Passive Sensing", "Peer Support"],
  },
  {
    title: "Explainable AI & Machine Learning",
    slug: "explainable-ai-ml",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
    tagline: "Making model behaviour legible to the people it affects.",
    description:
      "Research on explainability, fairness, and interpretability of ML systems — especially in high-stakes domains like health and finance. DIAL focuses on what explainability means for non-expert users in low-resource settings.",
    keywords: ["Explainability", "Fairness", "ML"],
  },
  {
    title: "ICT for Development (ICTD)",
    slug: "ictd",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-5.svg",
    tagline: "Technology interventions designed from the Global South.",
    description:
      "DIAL applies HCI and participatory methods to development challenges — financial inclusion, garment workers' lives, refugee health, and ride-sharing livelihoods. All work is grounded in long-term fieldwork with communities in Bangladesh.",
    keywords: ["ICTD", "Fieldwork", "Financial Inclusion"],
  },
  {
    title: "Safety & Security",
    slug: "safety-security",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-6.svg",
    tagline: "Personal safety technology co-designed with at-risk communities.",
    description:
      "Wearable safety systems, digital threat modelling, and surveillance resistance for vulnerable populations. DIAL builds safety tools with — not just for — people who face real, ongoing threats.",
    keywords: ["Online Safety", "Wearables", "Co-design"],
  },
  {
    title: "IoT & Low-cost Hardware",
    slug: "iot-low-cost-hardware",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    tagline: "Affordable sensing and interaction for resource-constrained contexts.",
    description:
      "Projects that push the limits of low-cost hardware — distributed sensing for flash floods, wearables for driver stress and stroke rehabilitation, and a medicine-reminder bot for older people in Bangladesh.",
    keywords: ["IoT", "Low-cost Hardware", "Sensing"],
  },
  {
    title: "Infodemic & Misinformation",
    slug: "infodemic-misinformation",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
    tagline: "Understanding how misinformation spreads in low-literacy populations.",
    description:
      "Research into how health misinformation spreads through social networks in South Asia, and what community-led and technology-assisted counter-measures look like in practice.",
    keywords: ["Misinformation", "Health", "Social Networks"],
  },
  {
    title: "Computing Education & Community",
    slug: "computing-education-community",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
    tagline: "Broadening participation in computing in the Global South.",
    description:
      "DIAL investigates barriers to computing education for women and underrepresented groups in Bangladesh, and builds community-based programs and tools to widen participation.",
    keywords: ["Computing Education", "Gender", "Community"],
  },
];


interface Feature199Props {
  themes: Feature199Theme[];
  className?: string;
}

const Feature199 = ({ themes, className }: Feature199Props) => {
  const features: FeatureArea[] = themes.flatMap((theme) => {
    const copy = AREA_COPY.find((area) => area.slug === theme.slug);
    return copy ? [{ ...copy, ...theme }] : [];
  });
  const [activeFeature, setActiveFeature] = useState(0);
  const [openArea, setOpenArea] = useState<FeatureArea | null>(null);
  // Keeps content stable during close animation
  const [stableArea, setStableArea] = useState<FeatureArea | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const items = container.getElementsByClassName("feature-item");
      const containerMiddle = window.innerHeight * 0.6;
      let closestItem = null;
      let closestDistance = Infinity;
      Array.from(items).forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - containerMiddle);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = index;
        }
      });
      if (closestItem !== null) setActiveFeature(closestItem);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const clampedActive = Math.min(activeFeature, features.length - 1);

  function openDialog(area: FeatureArea) {
    setStableArea(area);
    setOpenArea(area);
  }

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:mb-8 lg:text-6xl">
          Research Areas
        </h1>

        <div className="relative gap-6 pb-72 md:grid md:grid-cols-5 md:pb-0">
          <div className="col-span-3 pb-4" ref={containerRef}>
            <Separator />
            {features.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">
                No areas match that keyword.
              </p>
            )}
            {features.map((feature, index) => (
              <React.Fragment key={feature.slug}>
                <button
                  className="feature-item w-full py-3 text-left"
                  onMouseEnter={() => !isMobile && setActiveFeature(index)}
                  onClick={() => openDialog(feature)}
                >
                  <div className="flex items-start gap-7 md:gap-16 lg:gap-28">
                    <span
                      className={cn(
                        "invisible mt-3 size-2.5 shrink-0 rounded-full bg-primary md:size-3",
                        clampedActive === index && "visible",
                      )}
                    />
                    <h2
                      className={cn(
                        "text-[clamp(1.65rem,3vw,2.15rem)] font-bold text-muted-foreground transition-colors hover:text-primary",
                        clampedActive === index && "text-primary",
                      )}
                    >
                      {feature.title}
                    </h2>
                  </div>
                </button>
                <Separator />
              </React.Fragment>
            ))}
          </div>

          <div className="sticky bottom-3 left-3 col-span-2 h-72 w-fit border md:top-20 md:h-fit">
            <img
              src={features[clampedActive]?.image ?? features[0]?.image}
              alt={features[clampedActive]?.title ?? ""}
              className="h-72 md:h-auto"
            />
            <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              {features[clampedActive]?.tagline ?? ""}
            </p>
          </div>
        </div>
      </div>

      {/* Area preview dialog */}
      <Dialog open={openArea !== null} onOpenChange={(open) => { if (!open) setOpenArea(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{stableArea?.title}</DialogTitle>
            <DialogDescription>{stableArea?.tagline}</DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">{stableArea?.description}</p>

          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold">{stableArea?.projectCount}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stableArea?.pubCount}</p>
              <p className="text-xs text-muted-foreground">Publications</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {stableArea?.keywords.map((kw) => (
              <Badge key={kw} variant="outline" className="text-xs">
                {kw}
              </Badge>
            ))}
          </div>

          <DialogFooter showCloseButton>
            <Link href={`/research/${stableArea?.slug ?? ""}`}>
              <Button size="sm" onClick={() => setOpenArea(null)}>
                Explore area
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export { Feature199 };
