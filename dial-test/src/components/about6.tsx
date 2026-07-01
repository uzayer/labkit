import { cn } from "@/lib/utils";

interface About6Props {
  className?: string;
}

const About6 = ({ className }: About6Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col items-center justify-start gap-6 lg:flex-row">
          <div className="flex w-full flex-col items-start justify-start gap-24 lg:w-1/2">
            <div className="pr-6">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:mb-10 lg:text-6xl">
                About DIAL
              </h2>
              <p className="mb-9 text-muted-foreground lg:text-xl">
                DIAL (Design &amp; Inclusion Lab) is a research lab focused on
                inclusivity and access for marginalised communities—building
                technology that is locally appropriate, low-cost, and explainable.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg"
                alt="DIAL team moment"
                className="aspect-[0.7] w-full rounded-lg object-cover md:w-1/2"
              />
              <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-AkftcHujUmk-unsplash.jpg"
                  alt="Fieldwork context"
                  className="aspect-[1.1] rounded-lg object-cover"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-vGgn0xLdy8s-unsplash.jpg"
                  alt="Research in the lab"
                  className="aspect-[0.7] rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-12 pt-12 lg:w-1/2 lg:pt-48">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/johnson-wang-iI4sR_nkkbc-unsplash.jpg"
                alt="DIAL collaboration"
                className="aspect-[0.9] w-full rounded-lg object-cover md:w-1/2"
              />
              <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/nastuh-abootalebi-eHD8Y1Znfpk-unsplash.jpg"
                  alt="Workshop or discussion"
                  className="aspect-[0.8] rounded-lg object-cover"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/alvin-engler-bIhpiQA009k-unsplash.jpg"
                  alt="Team in the field"
                  className="aspect-[0.9] rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="px-8">
              <h3 className="mb-8 text-2xl font-semibold lg:mb-6">
                How the work happens
              </h3>
              <p className="mb-9 lg:text-xl">
                We do research with communities—through field visits, interviews,
                participatory design, and iterative prototyping—then translate
                findings into tools that people can actually use.
              </p>
              <p className="text-muted-foreground">
                Based in Dhaka, DIAL collaborates across universities, funders,
                and partners to study inclusion, safety, wellbeing, and
                development—always with attention to constraints like language,
                bandwidth, devices, and trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { About6 };
