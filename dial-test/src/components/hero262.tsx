import { cn } from "@/lib/utils";

interface DashedLineProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const DashedLine = ({
  orientation = "horizontal",
  className,
}: DashedLineProps) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "relative text-muted-foreground",
        isHorizontal ? "h-px w-full" : "h-full w-px",
        className,
      )}
    >
      <div
        className={cn(
          isHorizontal
            ? [
                "h-px w-full",
                "bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]",
                "[mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]",
              ]
            : [
                "h-full w-px",
                "bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]",
                "[mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)]",
              ],
        )}
      />
    </div>
  );
};

interface Stat {
  value: string;
  label: string;
}

interface Hero262Props {
  heading?: string;
  subheading?: string;
  description?: string;
  stats?: Stat[];
  className?: string;
}

const Hero262 = ({
  heading = "Democratising quality software",
  subheading = "Bringing modern software to life with AI magic.",
  description = "We are dedicated to transforming the way teams plan, execute, and deliver projects. Our mission is to provide our customers with an unbeatable edge over delays, inefficiencies, and disorganisation through actionable insights and seamless collaboration. We'll stop at nothing to give you the tools you need to get every project across the finish line.\n\nWe're customer-obsessed — investing the time to understand every aspect of your workflow so that we can help you operate better than ever before. We're all in this together because your success is our success.",
  stats = [
    {
      value: "$150M",
      label: "Raised",
    },
    {
      value: "20K",
      label: "Companies",
    },
    {
      value: "1.3B",
      label: "Monthly transactions",
    },
    {
      value: "1.5K",
      label: "Connections per minute",
    },
  ],
  className,
}: Hero262Props) => {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <h1 className="text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {heading}
          </h1>

          <p className="mt-5 text-2xl text-muted-foreground md:text-3xl lg:text-4xl">
            {subheading}
          </p>

          {description.trim() && (
            <div className="mt-6 max-w-lg space-y-4 text-base text-balance text-muted-foreground md:mt-8 md:space-y-6 md:text-lg lg:mt-12">
              {description
                .split("\n\n")
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>
          )}
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-3 pt-10 lg:pt-0 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="text-4xl tracking-wide md:text-5xl">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Hero262 };
