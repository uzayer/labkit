'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, GraduationCap, Globe, SearchIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TeamMember {
  name: string
  title: string
  affiliation: string
  badge?: string
  interests?: string[]
  scholar?: string
  site?: string
  slug: string
}

const facultyStaff: TeamMember[] = [
  {
    name: 'Nabil Bin Hannan',
    title: 'Assistant Professor, Department of Electrical and Computer Engineering',
    affiliation: 'NSU',
    slug: 'nabil-bin-hannan',
  },
  {
    name: 'Salekul Islam',
    title: 'Professor, Department of Electrical and Computer Engineering',
    affiliation: 'NSU',
    interests: ['XAI / ML', 'Mental Health'],
    slug: 'salekul-islam',
  },
  {
    name: 'Rahat Jahangir Rony',
    title: 'PhD Student and Researcher',
    affiliation: 'Cardiff University',
    interests: ['IoT / Hardware', 'Mental Health', 'Safety & Security'],
    scholar: 'https://scholar.google.com/citations?hl=en&user=BfxlMtoAAAAJ',
    slug: 'rahat-jahangir-rony',
  },
  {
    name: 'Anik Saha',
    title: 'Project Planning & Implementation Coordinator, DIAL',
    affiliation: 'NSU',
    interests: ['Computing Education', 'Feminist HCI'],
    scholar: 'https://scholar.google.com/citations?hl=en&user=fllXTssAAAAJ',
    slug: 'anik-saha',
  },
  {
    name: 'Anik Sinha',
    title: 'Lab Coordinator and Treasurer, DIAL',
    affiliation: 'NSU',
    interests: ['Accessibility', 'Misinformation'],
    scholar: 'https://scholar.google.com/citations?user=nSORcjEAAAAJ&hl=en',
    slug: 'anik-sinha',
  },
  {
    name: 'Ifti Azad Abeer',
    title: 'Research Coordinator, DIAL',
    affiliation: 'NSU',
    interests: ['ICTD', 'Accessibility', 'Autism'],
    scholar: 'https://scholar.google.com/citations?user=aZESbPcAAAAJ&hl=en',
    slug: 'ifti-azad-abeer',
  },
]

const graduateRAs: TeamMember[] = [
  { name: 'Antara Saha', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'antara-saha' },
  { name: 'Manoshi Das Turjo', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'manoshi-das-turjo' },
  { name: 'Monisha Dey', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'monisha-dey' },
  { name: 'Moostazi Maisha', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'moostazi-maisha' },
  { name: 'Sumit Kumar Kar', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'sumit-kumar-kar' },
  { name: 'Md. Jahidul Islam', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'md-jahidul-islam' },
  { name: 'Md. Shihab Reza', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'md-shihab-reza' },
  { name: 'Shahariar Ifti', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'shahariar-ifti' },
  { name: 'Shuvashish Chakraborty', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'shuvashish-chakraborty' },
  { name: 'F. M. Abir Hossain', title: 'Graduate Research Assistant', affiliation: 'NSU', slug: 'abir-hossain' },
]

const undergraduateRAs: TeamMember[] = [
  { name: 'Farhan Ahmed Fahim', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'farhan-ahmed-fahim' },
  { name: 'Shams Akbar Aalok', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'shams-akbar-aalok' },
  { name: 'Lamia Amin', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'lamia-amin' },
  { name: 'Sami Uddin', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'sami-uddin' },
  { name: 'Ashfaq Mahee Siddiky', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'ashfaq-mahee-siddiky' },
  { name: 'Obayed Ur Rahman', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'obayed-ur-rahman' },
  { name: 'Asif Mahbub', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'asif-mahbub' },
  { name: 'Eusra Amreen', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'eusra-amreen' },
  { name: 'Mahir Morshed', title: 'Undergraduate Research Assistant', affiliation: 'NSU', slug: 'mahir-morshed' },
  { name: 'Arefa Khandaker Rifa', title: 'Emerging Researcher', affiliation: 'NSU', badge: 'Emerging', slug: 'arefa-khandaker-rifa' },
  { name: 'Marzia Mahian Hridi', title: 'Emerging Researcher', affiliation: 'NSU', badge: 'Emerging', slug: 'marzia-mahian-hridi' },
  { name: 'Md. Azmine Amin Mormo', title: 'Emerging Researcher', affiliation: 'NSU', badge: 'Emerging', slug: 'md-azmine-amin-mormo' },
  { name: 'Tasnim Sharif Rowla', title: 'Emerging Researcher', affiliation: 'NSU', badge: 'Emerging', slug: 'tasnim-sharif-rowla' },
  { name: 'Ridwan Ur Rahman', title: 'Emerging Researcher', affiliation: 'NSU', badge: 'Emerging', slug: 'ridwan-ur-rahman' },
  { name: 'Samina Islam Mim', title: 'Emerging Researcher', affiliation: 'NSU', badge: 'Emerging', slug: 'samina-islam-mim' },
]

const collaborators: TeamMember[] = [
  { name: 'Dr. Lamia Iftekhar', title: 'Women in STEM Collaboration', affiliation: 'NSU', slug: 'lamia-iftekhar' },
  { name: 'Ms. Silvia Ahmed', title: 'Women in STEM Collaboration', affiliation: 'NSU', slug: 'silvia-ahmed' },
  { name: 'Tamanna Motahar', title: 'Associate Professor', affiliation: 'University of Louisiana at Lafayette', badge: 'On Leave', slug: 'tamanna-motahar' },
  { name: 'Moinuddin Bhuiyan', title: 'Collaborator', affiliation: 'Grameenphone', slug: 'moinuddin-bhuiyan' },
  { name: 'Nithya Sambasivan', title: 'Research Scientist', affiliation: 'Google', slug: 'nithya-sambasivan' },
  { name: 'Munir Hasan', title: 'ICT & Policy Collaboration', affiliation: 'ICT Division, Bangladesh', slug: 'munir-hasan' },
  { name: 'Abdul Wohab', title: 'Co-PI, SIPG Projects', affiliation: 'NSU', slug: 'abdul-wohab' },
  { name: 'Shameem Ahmed', title: 'Co-PI, Autism Parent–Teacher Project', affiliation: 'NSU', slug: 'shameem-ahmed' },
]

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// Rich card — used for Faculty & Research Staff
function MemberCard({ member }: { member: TeamMember }) {
  return (
    <a href={`/people/${member.slug}`}>
      <Card className="bg-card/50 group border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="relative mb-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl font-bold text-primary">
              {initials(member.name)}
            </div>
          </div>

          <div className="mb-4 text-center">
            <h3 className="group-hover:text-primary mb-1 text-lg font-semibold transition-colors">
              {member.name}
            </h3>
            <p className="text-primary mb-2 text-sm font-medium">{member.title}</p>
            <div className="flex flex-wrap justify-center gap-1">
              <Badge variant="outline" className="text-xs">
                {member.affiliation}
              </Badge>
              {member.badge && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {member.badge}
                </Badge>
              )}
            </div>
          </div>

          {member.interests && member.interests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-3">
              {member.interests.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-muted/50 px-2 py-1 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {(member.scholar || member.site) && (
            <div className="flex justify-center gap-3">
              {member.scholar && (
                <span
                  onClick={(e) => { e.preventDefault(); window.open(member.scholar, '_blank') }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GraduationCap className="size-3.5" />
                  Scholar
                </span>
              )}
              {member.site && (
                <span
                  onClick={(e) => { e.preventDefault(); window.open(member.site, '_blank') }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="size-3.5" />
                  Website
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  )
}

// Compact item — used for the larger groups
function MemberItem({ member }: { member: TeamMember }) {
  return (
    <div className="group">
      <a href={`/people/${member.slug}`} className="flex flex-col gap-1.5">
        <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
          <div className="flex aspect-square rounded-full items-center justify-center bg-muted text-base font-semibold text-muted-foreground group-hover:bg-primary/10 transition-colors">
            {initials(member.name)}
          </div>
        </div>
        <span className="mt-1 block text-sm font-medium leading-snug group-hover:text-primary transition-colors">
          {member.name}
        </span>
        <span className="text-muted-foreground block text-xs leading-snug">{member.affiliation}</span>
        {member.badge && (
          <span className="text-muted-foreground block text-xs italic">{member.badge}</span>
        )}
      </a>
      {(member.scholar || member.site) && (
        <div className="mt-1 flex gap-2">
          {member.scholar && (
            <a
              href={member.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <GraduationCap className="size-3.5" />
            </a>
          )}
          {member.site && (
            <a
              href={member.site}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="size-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function CompactGroup({ title, members }: { title: string; members: TeamMember[] }) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-medium">{title}</h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-8 border-t py-6 md:grid-cols-4 lg:grid-cols-6">
        {members.map((m) => (
          <MemberItem key={m.slug} member={m} />
        ))}
      </div>
    </div>
  )
}

interface Team5_9Props {
  className?: string
}

const Team5_9 = ({ className }: Team5_9Props) => {
  const [query, setQuery] = useState('')
  const [ugExpanded, setUgExpanded] = useState(false)

  const q = query.toLowerCase().trim()

  const filterMembers = (members: TeamMember[]) =>
    q ? members.filter((m) => m.name.toLowerCase().includes(q) || m.title.toLowerCase().includes(q)) : members

  const allFiltered = useMemo(
    () =>
      q
        ? [
            ...filterMembers(facultyStaff),
            ...filterMembers(graduateRAs),
            ...filterMembers(undergraduateRAs),
            ...filterMembers(collaborators),
          ]
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q],
  )

  const displayedUGRAs = ugExpanded ? undergraduateRAs : undergraduateRAs.slice(0, 9)

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative mb-10 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or role…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {allFiltered ? (
          allFiltered.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-4 gap-y-8 md:grid-cols-4 lg:grid-cols-6">
              {allFiltered.map((m) => (
                <MemberItem key={m.slug} member={m} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
          )
        ) : (
          <div className="space-y-12">
            {/* Faculty: full rich cards */}
            <div>
              <h3 className="mb-6 text-lg font-medium">Faculty &amp; Research Staff</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {facultyStaff.map((m) => (
                  <MemberCard key={m.slug} member={m} />
                ))}
              </div>
            </div>

            {/* Larger groups: compact team-1 style */}
            <CompactGroup title="Graduate Research Assistants" members={graduateRAs} />

            <div>
              <h3 className="mb-6 text-lg font-medium">Undergraduate Research Assistants</h3>
              <div className="grid grid-cols-3 gap-x-4 gap-y-8 border-t py-6 md:grid-cols-4 lg:grid-cols-6">
                {displayedUGRAs.map((m) => (
                  <MemberItem key={m.slug} member={m} />
                ))}
              </div>
              {!ugExpanded && (
                <button
                  onClick={() => setUgExpanded(true)}
                  className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className="size-4" />
                  Show all {undergraduateRAs.length}
                </button>
              )}
            </div>

            <CompactGroup title="Collaborators" members={collaborators} />
          </div>
        )}
      </div>
    </section>
  )
}

export default Team5_9
export { Team5_9 }
