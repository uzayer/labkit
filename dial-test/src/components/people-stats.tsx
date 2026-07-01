import { cn } from "@/lib/utils";

interface PeopleStatsProps {
  className?: string;
}

const stats = [
  { value: "50+", label: "Researchers mentored" },
  { value: "21", label: "Alumni placed" },
  { value: "20+", label: "Active projects" },
  { value: "9", label: "Years of research" },
];

const PeopleStats = ({ className }: PeopleStatsProps) => {
  return (
    <section className={cn("py-12 md:py-20", className)}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-0.5 *:text-center md:grid-cols-4 dark:[--color-muted:var(--color-zinc-900)]">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-muted rounded-(--radius) space-y-4 py-12">
              <div className="text-5xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { PeopleStats };
