import Image from "next/image";

import { eyebrow, sectionHeading } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface About6Props {
  className?: string;
}

// Three slots, not six: every photo here is one DIAL has to supply before
// launch, and media collection is the classic final-day blocker.
const photos = {
  tall: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg",
    alt: "DIAL team moment",
  },
  top: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-AkftcHujUmk-unsplash.jpg",
    alt: "Researchers at work",
  },
  bottom: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-vGgn0xLdy8s-unsplash.jpg",
    alt: "Laptops on a shared worktable",
  },
};

const photoSizes = "(min-width: 1024px) 25vw, 33vw";

const About6 = ({ className }: About6Props) => {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className={eyebrow}>About DIAL</p>
            <h2 className={cn(sectionHeading, "mt-4")}>
              Locally appropriate, low-cost, explainable.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              DIAL, the Design Inclusion and Access Lab, builds technology for
              inclusion and access at North South University in Dhaka.
            </p>
            <h3 className="mt-10 text-xl font-semibold tracking-tight">
              How the work happens
            </h3>
            <p className="mt-3 text-lg leading-8 text-muted-foreground">
              We do research with communities, through field visits,
              interviews, participatory design, and iterative prototyping, then
              translate findings into tools people can actually use.
            </p>
          </div>
          {/* A short row of three below lg, where a stacked collage would fill
              the screen; the tall two-column collage only beside the copy. */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted lg:row-span-2 lg:aspect-[0.7]">
              <Image
                src={photos.tall.src}
                alt={photos.tall.alt}
                fill
                sizes={photoSizes}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted lg:aspect-auto">
              <Image
                src={photos.top.src}
                alt={photos.top.alt}
                fill
                sizes={photoSizes}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted lg:aspect-auto">
              <Image
                src={photos.bottom.src}
                alt={photos.bottom.alt}
                fill
                sizes={photoSizes}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { About6 };
