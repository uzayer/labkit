import { cn } from "@/lib/utils";

interface Alumni {
  name: string;
  currentPosition?: string;
  alumniYear?: number;
}

const alumni: Alumni[] = [
  { name: "Mahbuba Tasmin", currentPosition: "PhD · University of Massachusetts Amherst", alumniYear: 2024 },
  { name: "Syeda Shabnam Khan", currentPosition: "Postgrad · RMIT, Australia", alumniYear: 2024 },
  { name: "Shajnush Amir", currentPosition: "Postgrad · University of Twente", alumniYear: 2023 },
  { name: "Sarah Binte Alam Shoilee", currentPosition: "PhD · Vrije Universiteit Amsterdam", alumniYear: 2023 },
  { name: "Kimia T. Zaman", currentPosition: "PhD · North Dakota State University", alumniYear: 2023 },
  { name: "Md. Sabbir Ahmed", currentPosition: "PhD · University of Virginia", alumniYear: 2023 },
  { name: "Tahsin Mayeesha", currentPosition: "PhD · University of North Texas", alumniYear: 2022 },
  { name: "Partho Anthony D' Costa", currentPosition: "Postgrad · Edith Cowan University", alumniYear: 2022 },
  { name: "Tanvir Hasan Fuad", currentPosition: "Postgrad · University of Oulu", alumniYear: 2022 },
  { name: "Ulfat Tahsin", currentPosition: "PhD · The Ohio State University", alumniYear: 2021 },
  { name: "Jannatul Shapna", currentPosition: "PhD · Kennesaw State University", alumniYear: 2021 },
  { name: "Tawfique Elahi", currentPosition: "PhD · University of Nevada, Reno", alumniYear: 2021 },
  { name: "Zareen Tasnim", currentPosition: "Postgrad · University of Exeter", alumniYear: 2020 },
  { name: "Mayisha Muntaha Alam", currentPosition: "Postgrad · University of Maryland", alumniYear: 2020 },
  { name: "Monirul Islam Mahmud", currentPosition: "Postgrad · Fordham University", alumniYear: 2020 },
  { name: "Rio Chakma", currentPosition: "Research Associate · IDLC, Bangladesh", alumniYear: 2019 },
  { name: "Majedur Rahman", currentPosition: "Software Engineer · Technuf, USA", alumniYear: 2019 },
  { name: "Shahreen Shahjahan Psyche", currentPosition: "Software Engineer · Amazon", alumniYear: 2019 },
  { name: "Md. Tanvir Mushfique", currentPosition: "Layout Engineer · ULKASEMI, Canada", alumniYear: 2018 },
  { name: "Mohammad Rayed", alumniYear: 2018 },
  { name: "Md. Tamjid Hosain", alumniYear: 2017 },
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

interface AlumniGridProps {
  className?: string;
}

const AlumniGrid = ({ className }: AlumniGridProps) => {
  const grouped = alumni.reduce<Record<number, Alumni[]>>((acc, person) => {
    const year = person.alumniYear ?? 0;
    if (!acc[year]) acc[year] = [];
    acc[year].push(person);
    return acc;
  }, {});

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-5xl px-6">
        <h3 className="mb-2 text-2xl font-semibold">Where our people go</h3>
        <p className="mb-10 text-muted-foreground">
          DIAL alumni are in PhD programmes, research institutions, and industry
          across three continents.
        </p>

        <div className="space-y-10">
          {years.map((year) => (
            <div key={year}>
              <h4 className="mb-4 text-sm font-medium text-muted-foreground">{year}</h4>
              <div className="grid grid-cols-3 gap-x-4 gap-y-6 border-t py-6 md:grid-cols-4 lg:grid-cols-6">
                {grouped[year].map((person) => (
                  <div key={person.name}>
                    <div className="bg-background size-14 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                      <div className="flex aspect-square rounded-full items-center justify-center bg-muted text-xs font-semibold text-muted-foreground">
                        {initials(person.name)}
                      </div>
                    </div>
                    <span className="mt-2 block text-sm font-medium leading-snug">{person.name}</span>
                    {person.currentPosition && (
                      <span className="text-muted-foreground block text-xs leading-snug mt-0.5">
                        {person.currentPosition}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { AlumniGrid };
