import { BookOpen, MapPin, Sparkles, Users } from "lucide-react";

import { cn } from "@/lib/utils";

interface Feature10Props {
  className?: string;
}

const Feature10 = ({ className }: Feature10Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <p className="mb-4 text-xs text-muted-foreground">Why DIAL?</p>
        <h2 className="text-3xl font-medium lg:text-4xl">
          Research that reaches the people who need it most
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <Sparkles className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                No prerequisites
                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                We look for curiosity, not credentials. If you ask good
                questions about people and technology, you belong here.
              </p>
            </div>
          </div>
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <MapPin className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Fieldwork in Bangladesh
                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                Our research happens in the field — with garment workers, urban
                youth, and rural health communities across Bangladesh.
              </p>
            </div>
          </div>
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <BookOpen className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Publish at top venues
                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                DIAL publishes at CHI, CSCW, UIST, and JMIR. Lab members
                co-author real papers with real international impact.
              </p>
            </div>
          </div>
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <Users className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                A lab, not a job
                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                Small team, flat hierarchy. Nova works directly with every lab
                member — you will never be lost in the crowd.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature10 };
