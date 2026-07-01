"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GraduationCap, Globe, Search, ChevronDown } from "lucide-react";

interface TeamMember {
  name: string;
  title: string;
  affiliation: string;
  badge?: string;
  interests?: string[];
  scholar?: string;
  site?: string;
  slug: string;
  initials: string;
}

const facultyStaff: TeamMember[] = [
  {
    name: "Nabil Bin Hannan",
    title: "Assistant Professor, Department of Electrical and Computer Engineering",
    affiliation: "NSU",
    interests: [],
    slug: "nabil-bin-hannan",
    initials: "NH",
  },
  {
    name: "Salekul Islam",
    title: "Professor, Department of Electrical and Computer Engineering",
    affiliation: "NSU",
    interests: ["XAI / ML", "Mental Health"],
    slug: "salekul-islam",
    initials: "SI",
  },
  {
    name: "Rahat Jahangir Rony",
    title: "PhD Student and Researcher",
    affiliation: "Cardiff University",
    interests: ["IoT / Hardware", "Mental Health", "Safety & Security"],
    scholar: "https://scholar.google.com/citations?hl=en&user=BfxlMtoAAAAJ",
    slug: "rahat-jahangir-rony",
    initials: "RR",
  },
  {
    name: "Anik Saha",
    title: "Project Planning & Implementation Coordinator, DIAL",
    affiliation: "NSU",
    interests: ["Computing Education", "Feminist HCI"],
    scholar: "https://scholar.google.com/citations?hl=en&user=fllXTssAAAAJ",
    slug: "anik-saha",
    initials: "AS",
  },
  {
    name: "Anik Sinha",
    title: "Lab Coordinator and Treasurer, DIAL",
    affiliation: "NSU",
    interests: ["Accessibility", "Misinformation"],
    scholar: "https://scholar.google.com/citations?user=nSORcjEAAAAJ&hl=en",
    slug: "anik-sinha",
    initials: "AS",
  },
  {
    name: "Ifti Azad Abeer",
    title: "Research Coordinator, DIAL",
    affiliation: "NSU",
    interests: ["ICTD", "Accessibility", "Autism"],
    scholar: "https://scholar.google.com/citations?user=aZESbPcAAAAJ&hl=en",
    slug: "ifti-azad-abeer",
    initials: "IA",
  },
];

const graduateRAs: TeamMember[] = [
  { name: "Antara Saha", title: "Graduate Research Assistant", affiliation: "NSU", slug: "antara-saha", initials: "AS" },
  { name: "Manoshi Das Turjo", title: "Graduate Research Assistant", affiliation: "NSU", slug: "manoshi-das-turjo", initials: "MT" },
  { name: "Monisha Dey", title: "Graduate Research Assistant", affiliation: "NSU", slug: "monisha-dey", initials: "MD" },
  { name: "Moostazi Maisha", title: "Graduate Research Assistant", affiliation: "NSU", slug: "moostazi-maisha", initials: "MM" },
  { name: "Sumit Kumar Kar", title: "Graduate Research Assistant", affiliation: "NSU", slug: "sumit-kumar-kar", initials: "SK" },
  { name: "Md. Jahidul Islam", title: "Graduate Research Assistant", affiliation: "NSU", slug: "md-jahidul-islam", initials: "JI" },
  { name: "Md. Shihab Reza", title: "Graduate Research Assistant", affiliation: "NSU", slug: "md-shihab-reza", initials: "SR" },
  { name: "Shahariar Ifti", title: "Graduate Research Assistant", affiliation: "NSU", slug: "shahariar-ifti", initials: "SI" },
  { name: "Shuvashish Chakraborty", title: "Graduate Research Assistant", affiliation: "NSU", slug: "shuvashish-chakraborty", initials: "SC" },
  { name: "F. M. Abir Hossain", title: "Graduate Research Assistant", affiliation: "NSU", slug: "abir-hossain", initials: "AH" },
];

const undergraduateRAs: TeamMember[] = [
  { name: "Farhan Ahmed Fahim", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "farhan-ahmed-fahim", initials: "FF" },
  { name: "Shams Akbar Aalok", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "shams-akbar-aalok", initials: "SA" },
  { name: "Lamia Amin", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "lamia-amin", initials: "LA" },
  { name: "Sami Uddin", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "sami-uddin", initials: "SU" },
  { name: "Ashfaq Mahee Siddiky", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "ashfaq-mahee-siddiky", initials: "AM" },
  { name: "Obayed Ur Rahman", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "obayed-ur-rahman", initials: "OR" },
  { name: "Asif Mahbub", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "asif-mahbub", initials: "AM" },
  { name: "Eusra Amreen", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "eusra-amreen", initials: "EA" },
  { name: "Mahir Morshed", title: "Undergraduate Research Assistant", affiliation: "NSU", slug: "mahir-morshed", initials: "MM" },
  { name: "Arefa Khandaker Rifa", title: "Emerging Researcher", affiliation: "NSU", badge: "Emerging", slug: "arefa-khandaker-rifa", initials: "AR" },
  { name: "Marzia Mahian Hridi", title: "Emerging Researcher", affiliation: "NSU", badge: "Emerging", slug: "marzia-mahian-hridi", initials: "MH" },
  { name: "Md. Azmine Amin Mormo", title: "Emerging Researcher", affiliation: "NSU", badge: "Emerging", slug: "md-azmine-amin-mormo", initials: "AM" },
  { name: "Tasnim Sharif Rowla", title: "Emerging Researcher", affiliation: "NSU", badge: "Emerging", slug: "tasnim-sharif-rowla", initials: "TR" },
  { name: "Ridwan Ur Rahman", title: "Emerging Researcher", affiliation: "NSU", badge: "Emerging", slug: "ridwan-ur-rahman", initials: "RR" },
  { name: "Samina Islam Mim", title: "Emerging Researcher", affiliation: "NSU", badge: "Emerging", slug: "samina-islam-mim", initials: "SM" },
];

const collaborators: TeamMember[] = [
  { name: "Dr. Lamia Iftekhar", title: "Women in STEM Collaboration", affiliation: "NSU", slug: "lamia-iftekhar", initials: "LI" },
  { name: "Ms. Silvia Ahmed", title: "Women in STEM Collaboration", affiliation: "NSU", slug: "silvia-ahmed", initials: "SA" },
  { name: "Tamanna Motahar", title: "Associate Professor", affiliation: "University of Louisiana at Lafayette", badge: "On Leave", slug: "tamanna-motahar", initials: "TM" },
  { name: "Moinuddin Bhuiyan", title: "Collaborator", affiliation: "Grameenphone", slug: "moinuddin-bhuiyan", initials: "MB" },
  { name: "Nithya Sambasivan", title: "Research Scientist", affiliation: "Google", slug: "nithya-sambasivan", initials: "NS" },
  { name: "Munir Hasan", title: "ICT & Policy Collaboration", affiliation: "ICT Division, Bangladesh", slug: "munir-hasan", initials: "MH" },
  { name: "Abdul Wohab", title: "Co-PI, SIPG Projects", affiliation: "NSU", slug: "abdul-wohab", initials: "AW" },
  { name: "Shameem Ahmed", title: "Co-PI, Autism Parent–Teacher Project", affiliation: "NSU", slug: "shameem-ahmed", initials: "SA" },
];

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <a
      href={`/people/${member.slug}`}
      className="flex gap-4 rounded-md border border-border p-4 hover:bg-muted/50 transition-colors"
    >
      {/* Photo / initials placeholder */}
      <div className="flex-shrink-0 size-20 rounded-md bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
        {member.initials}
      </div>

      {/* Content */}
      <div className="min-w-0 flex flex-col gap-1.5">
        <p className="font-medium leading-tight">{member.name}</p>
        <p className="text-sm text-muted-foreground leading-tight">{member.title}</p>

        {/* Affiliation + optional badge */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {member.affiliation}
          </Badge>
          {member.badge && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {member.badge}
            </Badge>
          )}
        </div>

        {/* Research interest tags */}
        {member.interests && member.interests.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {member.interests.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* External links */}
        {(member.scholar || member.site) && (
          <div className="flex gap-3 mt-0.5">
            {member.scholar && (
              <a
                href={member.scholar}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <GraduationCap className="size-3.5" />
                Scholar
              </a>
            )}
            {member.site && (
              <a
                href={member.site}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="size-3.5" />
                Website
              </a>
            )}
          </div>
        )}
      </div>
    </a>
  );
}

interface TeamSectionProps {
  className?: string;
}

const TeamSection = ({ className }: TeamSectionProps) => {
  const [query, setQuery] = useState("");
  const [ugExpanded, setUgExpanded] = useState(false);

  const q = query.toLowerCase().trim();

  const filterMembers = (members: TeamMember[]) =>
    q ? members.filter((m) => m.name.toLowerCase().includes(q) || m.title.toLowerCase().includes(q)) : members;

  const allFiltered = q
    ? [...filterMembers(facultyStaff), ...filterMembers(graduateRAs), ...filterMembers(undergraduateRAs), ...filterMembers(collaborators)]
    : null;

  const displayedUGRAs = ugExpanded ? undergraduateRAs : undergraduateRAs.slice(0, 6);

  return (
    <section className={cn("py-16", className)}>
      <div className="container">
        {/* Search bar */}
        <div className="relative mb-10 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or role…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Flat search results */}
        {allFiltered ? (
          allFiltered.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allFiltered.map((m) => <MemberCard key={m.slug} member={m} />)}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
          )
        ) : (
          <>
            <div className="mb-10">
              <h3 className="mb-4 text-xl font-semibold">Faculty &amp; Research Staff</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {facultyStaff.map((m) => <MemberCard key={m.slug} member={m} />)}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="mb-4 text-xl font-semibold">Graduate Research Assistants</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {graduateRAs.map((m) => <MemberCard key={m.slug} member={m} />)}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="mb-4 text-xl font-semibold">Undergraduate Research Assistants</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {displayedUGRAs.map((m) => <MemberCard key={m.slug} member={m} />)}
              </div>
              {!ugExpanded && (
                <button
                  onClick={() => setUgExpanded(true)}
                  className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className="size-4" />
                  Show all {undergraduateRAs.length} →
                </button>
              )}
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">Collaborators</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {collaborators.map((m) => <MemberCard key={m.slug} member={m} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export { TeamSection };
