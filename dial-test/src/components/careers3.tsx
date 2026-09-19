import { ArrowRight, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { labInfo } from "@/data/lab-info";
import { cn } from "@/lib/utils";

interface Careers3Props {
  className?: string;
}

const Careers3 = ({ className }: Careers3Props) => {
  const jobs = [
    {
      category: "Graduate Research Assistant",
      openings: [
        {
          title: "HCI Research Assistant — Mental Health & Wellbeing",
          description:
            "Conduct qualitative research exploring mental health support systems for urban youth in Bangladesh. Co-author publications at CHI, CSCW, and JMIR.",
          location: `${labInfo.institution}, Dhaka`,
          link: `mailto:${labInfo.email}`,
        },
        {
          title: "HCI Research Assistant — Accessibility & Inclusion",
          description:
            "Design and evaluate accessible technologies for marginalised communities. Involves field research and participatory user studies across Bangladesh.",
          location: `${labInfo.institution}, Dhaka`,
          link: `mailto:${labInfo.email}`,
        },
      ],
    },
    {
      category: "Undergraduate Research Assistant",
      openings: [
        {
          title: "Research Assistant (Emerging Researcher)",
          description:
            "Entry-level position for undergraduates curious about HCI research. Work alongside graduate researchers on active lab projects. No prior research experience required.",
          location: `${labInfo.institution}, Dhaka`,
          link: `mailto:${labInfo.email}`,
        },
      ],
    },
  ];

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold md:text-5xl">Current openings</h1>
          <div className="mx-auto mt-14 flex flex-col gap-16">
            {jobs.map((jobCategory) => (
              <div key={jobCategory.category}>
                <Badge>{jobCategory.category}</Badge>
                <div>
                  {jobCategory.openings.map((job) => (
                    <a
                      href={job.link}
                      key={job.title}
                      className="group block border-b py-7"
                    >
                      <h3 className="text-xl font-semibold group-hover:underline">
                        {job.title}
                      </h3>
                      <p className="mt-1 font-medium text-muted-foreground">
                        {job.description}
                      </p>
                      <div className="mt-4 flex justify-between gap-4 text-muted-foreground">
                        <div className="flex gap-2 text-sm md:text-base">
                          <MapPin className="h-auto w-4 shrink-0" />
                          <p>{job.location}</p>
                        </div>
                        <ArrowRight className="h-auto w-4" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Careers3 };
