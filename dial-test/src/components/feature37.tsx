import { cn } from "@/lib/utils";

interface Feature37Props {
  className?: string;
}

const moments = [
  {
    image: "https://picsum.photos/seed/dial-lab/800/600",
    title: "Lab sessions",
    caption: "Weekly meetings in Dhaka where ideas become research questions.",
    span: 2,
  },
  {
    image: "https://picsum.photos/seed/dial-field/800/600",
    title: "Fieldwork",
    caption: "Rajshahi, 2025. Research happens where the people are, not in the lab.",
    span: 3,
  },
  {
    image: "https://picsum.photos/seed/dial-iftar/800/600",
    title: "Iftar together",
    caption: "Every Ramadan the lab gathers. Research is also relationships.",
    span: 3,
  },
  {
    image: "https://picsum.photos/seed/dial-chi/800/600",
    title: "Conference trip",
    caption: "CHI 2024, Honolulu. DIAL researchers presenting to a global audience.",
    span: 2,
  },
  {
    image: "https://picsum.photos/seed/dial-july/800/600",
    title: "Solidarity",
    caption: "July Movement, 2024. The lab does not exist apart from the society it studies.",
    span: 2,
  },
  {
    image: "https://picsum.photos/seed/dial-present/800/600",
    title: "Research presentations",
    caption: "Sharing work at NSU. Every lab member presents — from their first semester.",
    span: 3,
  },
];

const colSpanClass: Record<number, string> = {
  2: "md:col-span-2",
  3: "md:col-span-3",
};

const Feature37 = ({ className }: Feature37Props) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="container">
        <div className="mb-10">
          <p className="mb-2 text-xs text-muted-foreground">Life at DIAL</p>
          <h2 className="text-3xl font-medium lg:text-4xl">
            What it is actually like to work here
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          {moments.map((moment) => (
            <div
              key={moment.title}
              className={cn(
                "flex flex-col justify-between rounded-lg bg-accent",
                colSpanClass[moment.span],
              )}
            >
              <img
                src={moment.image}
                alt={moment.title}
                className="aspect-video h-full max-h-72 w-full rounded-t-lg object-cover"
              />
              <div className="p-6">
                <p className="mb-2 text-lg font-semibold">{moment.title}</p>
                <p className="text-muted-foreground">{moment.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature37 };
