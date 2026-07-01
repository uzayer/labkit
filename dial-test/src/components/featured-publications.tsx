import { FlatPublicationList, type PublicationYear } from "@/components/publications1";
import { cn } from "@/lib/utils";

const featuredPublications: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: "fp1",
        title: "Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh",
        authors: "Nova Ahmed, Raisa Islam, Tanvir Hossain, Md. Shafiul Alam",
        venue: "ACM CHI",
        award: "Best Paper",
        pdfLink: "#",
        citationText: "Ahmed, N., Islam, R., Hossain, T., & Alam, M. S. (2024). Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh. In Proceedings of CHI 2024. ACM.",
        themes: ["Accessibility & Inclusion"],
        isOpenAccess: true,
        type: "conference",
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: "fp2",
        title: "Mon Majhi: Explainable Passive Sensing for Depression Screening in Low-Resource Settings",
        authors: "Nova Ahmed, Lamia Alam, Mehrab Bin Morshed",
        venue: "ACM CSCW",
        award: "Best Paper",
        pdfLink: "#",
        citationText: "Ahmed, N., Alam, L., & Morshed, M. B. (2023). Mon Majhi: Explainable Passive Sensing for Depression Screening in Low-Resource Settings. In Proceedings of CSCW 2023. ACM.",
        themes: ["Mental Health & Wellbeing", "Explainable AI & ML"],
        type: "conference",
      },
    ],
  },
  {
    year: 2022,
    publications: [
      {
        id: "fp3",
        title: "Designing for Friction: Safety Mechanisms in Peer-to-Peer Financial Systems for Garment Workers",
        authors: "Nova Ahmed, Fariha Chowdhury, Raisa Islam",
        venue: "ACM UIST",
        award: "Honourable Mention",
        pdfLink: "#",
        citationText: "Ahmed, N., Chowdhury, F., & Islam, R. (2022). Designing for Friction: Safety Mechanisms in Peer-to-Peer Financial Systems for Garment Workers. In Proceedings of UIST 2022. ACM.",
        themes: ["ICT for Development (ICTD)"],
        type: "conference",
      },
    ],
  },
  {
    year: 2019,
    publications: [
      {
        id: "fp4",
        title: "They Don't Leave Us Alone Anywhere We Go: Gender and Digital Abuse in South Asia",
        authors: "Nithya Sambasivan, Afsaneh Batool, Nova Ahmed, Tara Matthews, Kurt Thomas, Laura Gaytán-Lugo, David Nemer, Elie Bursztein, Elizabeth Churchill, Sunny Consolvo",
        venue: "ACM CHI",
        award: "Best of CHI",
        pdfLink: "#",
        citationText: "Sambasivan, N., Batool, A., Ahmed, N., et al. (2019). They Don't Leave Us Alone Anywhere We Go. In Proceedings of CHI 2019. ACM.",
        themes: ["Safety & Security", "Gender & Feminist HCI"],
        isCollaboration: true,
        type: "conference",
      },
    ],
  },
];

interface FeaturedPublicationsProps {
  className?: string;
}

export function FeaturedPublications({ className }: FeaturedPublicationsProps) {
  return (
    <section className={cn(className)}>
      <div className="container">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold">Award-winning work</h2>
          <a
            href="/publications"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            All publications →
          </a>
        </div>
        <FlatPublicationList yearGroups={featuredPublications} />
      </div>
    </section>
  );
}
