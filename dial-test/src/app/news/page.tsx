import { NewsFeed, type NewsEntry } from "@/components/news-feed";

const entries: NewsEntry[] = [
  // 2026 — upcoming
  {
    type: "academic",
    title: "Presenting at ACM CHI 2026, Yokohama, Japan",
    date: "2026-04-27",
    description:
      "DIAL presents research on digital equity and accessible HCI design at CHI 2026.",
    url: "https://chi2026.acm.org",
    photo: "https://picsum.photos/seed/dial-chi2026/800/600",
  },

  // 2025
  {
    type: "event",
    title: "DIAL HCI Research Symposium 2025",
    date: "2025-11-15",
    description:
      "DIAL hosted its annual HCI Research Symposium, bringing together researchers from across Bangladesh and beyond to present ongoing work and foster collaboration. The day-long event featured paper presentations, a keynote, and an open poster session.",
    photo: "https://picsum.photos/seed/dial-symposium2025/800/600",
  },
  {
    type: "academic",
    title: "Presenting at ACM CSCW 2025, Pittsburgh, PA",
    date: "2025-10-20",
    description:
      "Lab members presented two full papers at CSCW 2025 on social media and crisis communication in low-resource contexts.",
    photo: "https://picsum.photos/seed/dial-cscw2025/800/600",
  },
  {
    type: "academic",
    title: "Invited Talk — University of Copenhagen, Denmark",
    date: "2025-09-05",
    description:
      "Nova Ahmed delivered an invited talk on HCI for the Global South at the University of Copenhagen's Computer Science department.",
    photo: "https://picsum.photos/seed/dial-copenhagen/800/600",
  },
  {
    type: "community",
    title: "SIGCHI Dhaka Chapter — Annual Meetup",
    date: "2025-07-12",
    description:
      "DIAL co-organised the annual SIGCHI Dhaka chapter meetup, bringing together HCI researchers and practitioners in Dhaka for a half-day of talks, networking, and community building. Over 40 attendees from industry and academia participated.",
    photo: "https://picsum.photos/seed/dial-sigchi-dhaka/800/600",
  },
  {
    type: "academic",
    title: "Attending ICTD 2025, Nairobi, Kenya",
    date: "2025-06-03",
    description:
      "DIAL graduate researchers attended ICTD 2025 and participated in the doctoral consortium.",
    photo: "https://picsum.photos/seed/dial-ictd2025/800/600",
  },

  // 2024
  {
    type: "community",
    title: "Flood Relief 2024 — Digital Coordination Support",
    date: "2024-09-10",
    description:
      "Following the devastating 2024 floods in Bangladesh, DIAL contributed to digital relief coordination: mapping inundated areas, verifying aid requests on social platforms, and connecting affected communities with resources. Lab members volunteered for two weeks.",
    photo: "https://picsum.photos/seed/dial-flood2024/800/600",
  },
  {
    type: "community",
    title: "Support for the July 2024 Movement",
    date: "2024-07-20",
    description:
      "DIAL members actively supported Bangladesh's July 2024 pro-reform movement through documentation, digital coordination, and community aid. The lab paused normal research activities to assist with on-the-ground needs during this pivotal moment.",
    photo: "https://picsum.photos/seed/dial-july2024/800/600",
  },
  {
    type: "academic",
    title: "Presenting at ACM COMPASS 2024",
    date: "2024-06-19",
    description:
      "Two papers presented at COMPASS 2024 on digital literacy and rural ICT4D in Bangladesh.",
    photo: "https://picsum.photos/seed/dial-compass2024/800/600",
  },
  {
    type: "academic",
    title: "Presenting at ACM CHI 2024, Honolulu, Hawai'i",
    date: "2024-05-14",
    description:
      "DIAL presented a full paper at CHI 2024 on privacy perceptions among low-income urban women in Bangladesh.",
    photo: "https://picsum.photos/seed/dial-chi2024/800/600",
  },
  {
    type: "event",
    title: "BanglaCHI 2024 — Workshop at CHI",
    date: "2024-05-12",
    description:
      "DIAL co-organised BanglaCHI 2024, a CHI workshop on HCI research in and for Bangladesh. The workshop brought together researchers working on context-aware design for South Asian communities and produced a community research agenda.",
    url: "https://bangla-chi.github.io",
    photo: "https://picsum.photos/seed/dial-bangla-chi/800/600",
  },
  {
    type: "academic",
    title: "SIGCHI Summer School on Inclusive Design",
    date: "2024-08-05",
    description:
      "Two DIAL graduate students attended the SIGCHI Summer School on inclusive design methods.",
    photo: "https://picsum.photos/seed/dial-summer-school/800/600",
  },
];

export default function NewsPage() {
  return (
    <>
      {/* §0 Page hero */}
      <section className="relative border-b py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/grid1.svg')] bg-contain bg-repeat opacity-40 [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]" />
        <div className="container relative">
          <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Lab Activity
          </p>
          <h1 className="text-5xl font-semibold tracking-tighter lg:text-7xl">
            News
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Conference presentations, hosted events, and community work — in
            photos.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Academic
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Event
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Community
            </span>
          </div>
        </div>
      </section>

      {/* §1 Feed */}
      <NewsFeed entries={entries} />
    </>
  );
}
