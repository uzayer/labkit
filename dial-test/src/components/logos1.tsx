import { cn } from "@/lib/utils";

interface Logos1Props {
  className?: string;
}

const Logos1 = ({ className }: Logos1Props) => {
  const partners = [
    {
      name: "ACM CHI",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
    },
    {
      name: "ACM CSCW",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-wordmark.svg",
    },
    {
      name: "ACM ASSETS",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/supabase-wordmark.svg",
    },
    {
      name: "ACM COMPASS",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/figma-wordmark.svg",
    },
    {
      name: "ACM UbiComp",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
    },
    {
      name: "ACM ICTD",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-wordmark.svg",
    },
  ];

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
