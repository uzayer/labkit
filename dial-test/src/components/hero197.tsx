import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { labInfo } from "@/data/lab-info";
import { cn } from "@/lib/utils";

interface Hero197Props {
  className?: string;
}

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

// The badge reports the recorded recruitment window against today's date, so it
// never claims applications are open after the window closes.
function recruitmentBadge(now = new Date()): string | null {
  const recruitment = labInfo.recruitment;
  if (!recruitment) return null;
  const opens = new Date(recruitment.opens);
  const closes = new Date(`${recruitment.closes}T23:59:59Z`);
  const range = `${formatDay(recruitment.opens)} – ${formatDay(recruitment.closes)}, ${closes.getUTCFullYear()}`;
  if (now < opens) return `Applications open ${range}`;
  if (now <= closes) return `Applications open · ${range}`;
  return `Last recruitment · ${range}`;
}

const Hero197 = ({ className }: Hero197Props) => {
  const badge = recruitmentBadge();
  return (
    <section className={cn("relative overflow-hidden py-32", className)}>
      <div className="container">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            {badge && (
              <Badge
                variant="outline"
                className="mb-6 bg-background px-4 py-1.5 text-sm"
              >
                {badge} <Sparkles className="ml-1 size-3.5" />
              </Badge>
            )}

            <h1 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-5xl font-bold text-transparent md:text-6xl lg:text-7xl">
              Join DIAL
            </h1>

            <p className="mt-6 max-w-xl text-xl text-muted-foreground">
              No prerequisites. If you are curious about how technology shapes
              lives in Bangladesh — and want to do research that matters — DIAL
              is for you.
            </p>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href={`mailto:${labInfo.email}`}>Apply now</a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <a href="/research">Explore our research</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero197 };
