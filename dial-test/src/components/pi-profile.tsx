import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GraduationCap, Mail } from "lucide-react";

interface PIProfileProps {
  className?: string;
}

const awards = [
  "Best of CHI 2019",
  "IAPP Distinguished Privacy Award, SOUPS 2018",
  "COMPASS Best Paper 2023",
  "Google Research Award 2023",
];

const links = [
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=rXMM2MwAAAAJ&hl=en",
    icon: <GraduationCap className="size-4" />,
  },
  {
    label: "nova.ahmed@northsouth.edu",
    href: "mailto:nova.ahmed@northsouth.edu",
    icon: <Mail className="size-4" />,
  },
];

const PIProfile = ({ className }: PIProfileProps) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="container">
        <div className="grid gap-10 md:grid-cols-[2fr_3fr]">
          {/* Portrait */}
          <div>
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg"
              alt="Dr. Nova Ahmed"
              className="w-full rounded-lg object-cover aspect-square"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center gap-5">
            <div>
              <h1 className="text-3xl font-bold">Dr. Nova Ahmed</h1>
              <p className="mt-1 text-muted-foreground">
                Professor, Department of Electrical and Computer Engineering,
                North South University
              </p>
            </div>

            <p className="text-base leading-relaxed">
              Dr. Nova Ahmed founded NSUHCI in 2017 through collaboration with
              Google, establishing DIAL as a research home for technology design
              that centres inclusion and access. She leads the lab&apos;s focus
              on privacy, accessibility, financial inclusion, and HCI for the
              Global South — work grounded in feminist methodology and
              participatory design. As Chair of the Dhaka ACM SIGCHI Chapter
              (BanglaCHI), she anchors Bangladesh&apos;s HCI community in the
              global conversation. She has mentored 50+ researchers since 2017,
              many now in PhD programmes at Cardiff, UMass Amherst, Ohio State,
              and beyond.
            </p>

            {/* Award badges */}
            <div className="flex flex-wrap gap-2">
              {awards.map((award) => (
                <Badge
                  key={award}
                  variant="outline"
                  className="border-amber-400/60 text-amber-700 dark:text-amber-400"
                >
                  {award}
                </Badge>
              ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>

            <Link
              href="/people/nova-ahmed"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              → Full profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PIProfile };
