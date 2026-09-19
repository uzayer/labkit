import { cn } from "@/lib/utils";

interface Logos1Props {
  /** Venue names, most-published first. */
  venues: string[];
  className?: string;
}

const Logos1 = ({ venues, className }: Logos1Props) => {
  // Placeholder wordmark images (DIAL has not supplied venue logos); the venue
  // names come from Venue records via props and are used as alt text.
  const placeholderLogos = [
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-wordmark.svg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/supabase-wordmark.svg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/figma-wordmark.svg",
  ];
  const partners = venues.map((name, index) => ({
    name,
    logo: placeholderLogos[index % placeholderLogos.length],
  }));
  if (partners.length === 0) return null;

  return (
    <section
      className={cn(
        "container flex flex-wrap items-center justify-between gap-12 py-32",
        className,
      )}
    >
      <p className="text-lg leading-[140%] tracking-[-0.32px] text-primary">
        Published at
      </p>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-6 opacity-70 grayscale lg:gap-[60px]">
        {partners.map((partner, index) => (
          <img
            key={index}
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={109}
            height={48}
            className="object-contain"
          />
        ))}
      </div>
    </section>
  );
};

export { Logos1 };
