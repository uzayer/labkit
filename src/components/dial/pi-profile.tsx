import { AwardList, type AwardListItem } from '@/components/dial/award-list'
import { TextLink } from '@/components/dial/editorial'
import { label } from '@/lib/dial/typography'
import { MountedPortrait } from '@/components/dial/mounted-portrait'
import { cn } from '@/lib/utils'

export interface PIProfileData {
  name: string
  title: string
  photo?: string | null
  bio?: string | null
  awards: AwardListItem[]
  scholarUrl?: string | null
  email?: string | null
  profileHref: string
}

interface PIProfileProps {
  pi: PIProfileData
  className?: string
}

/** The Lab's PI, featured above the roster. */
const PIProfile = ({ pi, className }: PIProfileProps) => (
  <section className={cn('container', className)}>
    <div className="grid gap-10 border-t border-border pt-6 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
      <MountedPortrait src={pi.photo} name={pi.name} alt={`Dr. ${pi.name}`} priority />

      <div className="flex flex-col">
        <p className={label}>Principal Investigator</p>
        <h2 className="font-display mt-3 text-4xl leading-tight md:text-5xl">Dr. {pi.name}</h2>
        <p className="mt-2 text-muted-foreground">{pi.title}</p>

        {pi.bio && (
          <p className="mt-6 max-w-prose leading-relaxed text-pretty md:text-lg">{pi.bio}</p>
        )}

        {/* Recognition as its own ruled list — name, body, year, paper — not
            a run of joined sentences that read the same as the bio above. */}
        <AwardList awards={pi.awards} className="mt-8 max-w-prose" />

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <TextLink href={pi.profileHref}>Full profile</TextLink>
          {pi.scholarUrl && (
            <TextLink
              href={pi.scholarUrl}
              external
              className="text-muted-foreground hover:text-foreground"
            >
              Google Scholar
            </TextLink>
          )}
          {pi.email && (
            <a
              href={`mailto:${pi.email}`}
              className="text-sm text-muted-foreground underline decoration-border underline-offset-[6px] transition-colors hover:text-foreground"
            >
              {pi.email}
            </a>
          )}
        </div>
      </div>
    </div>
  </section>
)

export { PIProfile }
