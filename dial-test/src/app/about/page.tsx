import { Cta12 } from "@/components/cta12";
import { Logos1 } from "@/components/logos1";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "About — DIAL",
  description:
    "DIAL is a research lab at North South University, Dhaka, focused on inclusivity and access for marginalised communities through participatory design and fieldwork.",
};

const values = [
  {
    title: "Participation over prescription",
    body: "We design with communities, not for them. Every project begins with fieldwork — listening before building.",
  },
  {
    title: "Constraints as design material",
    body: "Low bandwidth, limited literacy, affordable hardware. We treat the real conditions of our users as the starting point, not an afterthought.",
  },
  {
    title: "Rigour from the margins",
    body: "HCI from Bangladesh can set the agenda. Our work surfaces problems — and solutions — that richer contexts miss.",
  },
  {
    title: "Mentorship as mission",
    body: "Fifty-plus researchers mentored since 2017. Many now in PhD programmes at Cardiff, Ohio State, UMass, and VU Amsterdam. The lab is a launchpad.",
  },
];

const stats = [
  { value: "2017", label: "Founded at NSU" },
  { value: "50+", label: "Researchers mentored" },
  { value: "20+", label: "Active projects" },
  { value: "65+", label: "Publications" },
];

const methods = [
  {
    title: "Fieldwork first",
    body: "Projects begin with interviews, visits, workshops, and patient listening before a tool is proposed.",
  },
  {
    title: "Prototype with communities",
    body: "Ideas are made tangible early, then reshaped through feedback from the people expected to use them.",
  },
  {
    title: "Publish and deploy",
    body: "The lab turns findings into papers, systems, methods, and student research trajectories.",
  },
];

const milestones = [
  {
    year: "2017",
    title: "Lab foundations",
    body: "DIAL starts at North South University with a focus on locally grounded HCI research.",
  },
  {
    year: "2019",
    title: "Global HCI recognition",
    body: "Community-centered safety and inclusion work earns attention at leading HCI venues.",
  },
  {
    year: "2024",
    title: "Broader research platform",
    body: "The lab now spans accessibility, ICTD, mental health, explainable AI, safety, and education.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b py-20 lg:py-28">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-5">
                North South University · Dhaka, Bangladesh
              </Badge>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tighter text-balance lg:text-7xl">
                HCI research from the margins, built with the people it serves.
              </h1>
              <p className="mt-6 max-w-2xl text-xl text-muted-foreground lg:text-2xl">
                DIAL studies access, inclusion, safety, wellbeing, and development
                in real-world Bangladeshi contexts where constraints shape the work.
              </p>
            </div>

            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle>Design &amp; Inclusion Lab</CardTitle>
                <CardDescription>
                  Participatory technology research at North South University.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-2 border-primary pl-4 text-lg leading-relaxed text-muted-foreground">
                  We design with communities, not around them.
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b py-10">
        <div className="container grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-6">
              <div className="text-3xl font-semibold tracking-tight lg:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              What We Do
            </p>
            <h2 className="text-3xl font-semibold tracking-tight lg:text-5xl">
              Research that treats constraints as design material.
            </h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground lg:text-lg">
              <p>
                DIAL (Design &amp; Inclusion Lab) was founded in 2017 by Dr.
                Nova Ahmed through a collaboration with Google. We are based in
                the Department of Electrical and Computer Engineering at North
                South University, Dhaka.
              </p>
              <p>
                Our research focuses on inclusivity and access for marginalised
                communities — building technology that is locally appropriate,
                low-cost, and explainable. We use participatory design and
                long-term fieldwork to understand problems from the inside, then
                build and evaluate technology interventions with the people who
                will use them.
              </p>
              <p>
                Based in Dhaka, we collaborate across universities, funders, and
                partners to study inclusion, safety, wellbeing, and development
                — always with attention to constraints like language, bandwidth,
                devices, and trust.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardHeader>
                    <CardTitle>{value.title}</CardTitle>
                    <CardDescription>{value.body}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-accent/40 py-20">
        <div className="container">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              How the Work Happens
            </p>
            <h2 className="text-3xl font-semibold tracking-tight lg:text-5xl">
              From field insight to usable systems.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {methods.map((method, index) => (
              <div key={method.title}>
                <div className="mb-5 flex items-center gap-4">
                  <Badge variant="outline">0{index + 1}</Badge>
                  <Separator className="flex-1" />
                </div>
                <h3 className="text-xl font-semibold">{method.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {method.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Lab Story
            </p>
            <h2 className="text-3xl font-semibold tracking-tight lg:text-5xl">
              A compact timeline for the prototype.
            </h2>
          </div>

          <div className="space-y-0">
            {milestones.map((milestone, index) => (
              <div key={milestone.year}>
                <div className="grid gap-6 py-7 sm:grid-cols-[8rem_1fr]">
                  <div className="text-2xl font-semibold tracking-tight">
                    {milestone.year}
                  </div>
                  <div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {milestone.body}
                    </p>
                  </div>
                </div>
                {index < milestones.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Logos1 className="border-t py-16" />

      <Cta12
        heading="Curious about the work?"
        description="Browse our research areas, explore ongoing projects, or reach out to collaborate."
        buttons={{
          primary: { text: "Explore research", url: "/research" },
          secondary: { text: "Contact us", url: "/contact" },
        }}
        className="py-16"
      />
    </>
  );
}
