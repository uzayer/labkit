import {
  InkBand,
  PrimaryLink,
  PullQuote,
  SectionHeader,
  TextLink,
  ThemeSpotlight,
  sectionSpacing,
} from '@/components/dial/editorial'
import Link from 'next/link'

import { FieldNote } from '@/components/dial/field-note'
import { CircleMark, MarginNote, SquiggleUnderline, Tape } from '@/components/dial/marks'
import { PageHeader } from '@/components/dial/page-header'
import { PartnerStrip } from '@/components/dial/partner-strip'
import { ProjectIndex } from '@/components/dial/project-index'
import { FlatPublicationList } from '@/components/dial/publications1'
import { ResearchScrollHero } from '@/components/dial/research-scroll-hero'
import { RisoArt } from '@/components/dial/riso'
import { displaySectionTitle, label } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'
import { getDial } from '@/lib/dial/data/get'

const AUDIENCES = [
  {
    label: 'Students',
    text: 'Undergraduate and graduate researchers learning to build with care.',
  },
  {
    label: 'Collaborators',
    text: 'Researchers who want co-authored, co-designed work.',
  },
  {
    label: 'Partners',
    text: 'Universities, NGOs, funders, and community groups.',
  },
]

/**
 * A filled action and a text link, side by side from `sm`. On a phone they
 * stack, and stacked a bare text link sat under the pill's edge while the
 * pill's words began a padding further in, so neither edge lined up. There the
 * link is drawn as an outline pill of the same height and padding: two
 * buttons on one left edge, their words on one left edge too.
 */
const heroActions = 'mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-8'
const secondaryAction =
  'text-muted-foreground hover:text-foreground max-sm:rounded-full max-sm:border max-sm:border-border max-sm:px-5 max-sm:py-2.5 max-sm:text-foreground'

export default async function Home() {
  const {
    labInfo,
    researchThemes,
    publicationsByYear,
    featuredPublications,
    featuredProjects,
    homePartnerOrganizations,
    labStats,
    themeStats,
    highlightAuthors,
    toPublicationYears,
    toProjectEntry,
  } = await getDial()
  const stats = labStats()
  const featured = featuredPublications()
  // Featured publications, or the most recent five when none are marked.
  const selected = featured.length > 0 ? featured : publicationsByYear().slice(0, 5)

  // Which three themes lead is derived, not curated. `featured` on the records
  // is an editorial flag from the prototype and marks six of nine, which is not
  // a shortlist; counting the projects and papers actually filed against each
  // theme is both defensible ("this is where the work is", which is what the
  // section claims) and self-maintaining — a Lab Editor never has to revisit it,
  // and it cannot go stale the way a hand-picked three would.
  const rankedThemes = researchThemes
    .map((theme) => {
      const counts = themeStats(theme.id)
      return {
        slug: theme.slug,
        title: theme.title,
        description: theme.shortDescription,
        projectCount: counts.projects,
        publicationCount: counts.publications,
        weight: counts.projects + counts.publications,
      }
    })
    .sort((a, b) => b.weight - a.weight)
  const leadThemes = rankedThemes.slice(0, 3)
  // The rest keep the taxonomy's own order, so the line reads as the lab's
  // list rather than as a leaderboard continuing past third place.
  const restOrder = new Set(rankedThemes.slice(3).map((t) => t.slug))
  const restThemes = rankedThemes
    .filter((t) => restOrder.has(t.slug))
    .sort(
      (a, b) =>
        researchThemes.findIndex((t) => t.slug === a.slug) -
        researchThemes.findIndex((t) => t.slug === b.slug),
    )

  return (
    <>
      {/* Children render inside the band that rises over the scroll hero, in
          the opposite theme to the rest of the page. */}
      <ResearchScrollHero>
        <PageHeader
          eyebrow="Design Inclusion and Access Lab · North South University, Dhaka"
          title={
            <>
              Technology for communities design usually{' '}
              <span className="relative inline-block">
                misses.
                <CircleMark />
              </span>
            </>
          }
          description="DIAL studies how people live with technology in low-resource, high-stakes settings, then builds inclusive systems with the communities who will use them."
          facts={[
            { value: String(stats.publications), label: 'Publications' },
            { value: String(stats.labAwards), label: 'Awards' },
            ...(stats.yearsOfResearch
              ? [{ value: String(stats.yearsOfResearch), label: 'Years of research' }]
              : []),
          ]}
          art="bloom"
          animateIn={false}
          className="py-0 md:py-0"
        >
          <div className={heroActions}>
            <PrimaryLink href="/research">Explore the research</PrimaryLink>
            <TextLink href="/join-us" className={secondaryAction}>
              Join the lab
            </TextLink>
          </div>
          <PartnerStrip
            label="In collaboration with"
            partners={homePartnerOrganizations()}
            className="mt-12 border-t border-border pt-6"
          />
        </PageHeader>
      </ResearchScrollHero>

      {/* About DIAL, as a notebook page rather than two columns of type: the
          heading with a sourced note pencilled under it, the prose, and a
          plate taped into the margin that is itself the way to /about — the
          spot a photograph of the lab goes when DIAL supplies one. */}
      <section className={cn('container', sectionSpacing)}>
        <div
          data-reveal
          className="relative grid gap-10 pt-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_16rem] lg:gap-16"
        >
          <span aria-hidden className="reveal-rule absolute inset-x-0 top-0 h-px bg-border" />
          <div className="reveal-item flex flex-col gap-8">
            <div>
              <p className={cn(label, 'mb-3')}>About DIAL</p>
              <h2 className={cn(displaySectionTitle, 'text-balance')}>
                Locally appropriate, low-cost, explainable.
              </h2>
            </div>
            <FieldNote source={`NSUHCI, ${labInfo.hciResearchSince}`} className="max-lg:hidden">
              Before it had a name, DIAL was a few people at NSU starting HCI research with Google,
              in {labInfo.hciResearchSince}.
            </FieldNote>
          </div>
          <div className="reveal-item max-w-prose space-y-5 leading-relaxed text-pretty text-muted-foreground md:text-lg">
            <p>
              <span className="text-foreground">
                DIAL—the Design Inclusion and Access Lab at North South University—
              </span>
              builds technology for inclusion and access in Dhaka.
            </p>
            <p>
              We do research with communities, through field visits, interviews, participatory
              design, and iterative prototyping, then translate findings into tools people can
              actually use.
            </p>
            <TextLink href="/about" className="pt-2 text-base">
              About the lab
            </TextLink>
          </div>
          <Link
            href="/about"
            // Starts with the words printed on the card, so speech input can
            // name it ("the lab, 2012–now"), and says where it goes.
            aria-label={`the lab, ${labInfo.foundedYear}–now: about DIAL`}
            className="reveal-item group ease-snappy relative block w-full max-w-72 self-start rounded-md border border-border bg-muted/40 p-4 transition-transform duration-150 active:scale-[0.98]"
          >
            <span
              aria-hidden
              className="halftone absolute inset-0 rounded-[inherit] opacity-[0.07]"
            />
            <span className="mark-lift relative block">
              <span className="relative grid aspect-4/5 place-items-center overflow-hidden rounded-sm bg-background shadow-[0_1px_0_0_var(--paper-line),0_12px_28px_-18px_rgba(0,0,0,0.45)]">
                <RisoArt variant="bloom" className="size-[78%]" />
              </span>
              <Tape />
            </span>
            <span className="font-hand text-ink relative mt-4 block text-xl leading-tight">
              <span className="relative">
                the lab, {labInfo.foundedYear}–now
                <SquiggleUnderline />
              </span>
            </span>
          </Link>
        </div>
      </section>

      <section className={cn('container', sectionSpacing, 'relative')}>
        <SectionHeader
          label="Research"
          title="Where social need and technical systems meet"
          description="Nine areas, ranked here by how much of the lab's work sits in each. The three with the most projects and papers behind them lead."
          link={{ text: 'All nine areas', href: '/research' }}
          className="mb-8"
        />
        <ThemeSpotlight lead={leadThemes} rest={restThemes} />
      </section>

      {/* The themes say what DIAL studies; the projects are what that looks
          like on the ground, and the directory had no way in from Home. */}
      <section className={cn('container', sectionSpacing)}>
        <SectionHeader
          label="Projects"
          title="What the work looks like on the ground"
          link={{ text: `All ${stats.projects} projects`, href: '/projects' }}
          className="mb-6"
        />
        <ProjectIndex projects={featuredProjects().slice(0, 3).map(toProjectEntry)} />
      </section>

      <section className={cn('container', sectionSpacing)}>
        <SectionHeader
          label="Publications"
          title="Selected work"
          link={{ text: 'All publications', href: '/publications' }}
          className="mb-6"
        />
        <FlatPublicationList
          yearGroups={toPublicationYears(selected)}
          highlightAuthors={highlightAuthors()}
          showYear
        />
      </section>

      {/* The page's one full-bleed section. Everything around it is hairlines
          and open paper, which is the only reason this reads as an interruption
          rather than as the rhythm. */}
      <InkBand>
        <PullQuote>Technology that is locally appropriate, low-cost, and explainable.</PullQuote>
      </InkBand>

      <section className={cn('container', sectionSpacing)}>
        <SectionHeader
          label="Work with us"
          title="Research with purpose. Join the lab."
          description="DIAL welcomes people who want rigorous technology work to stay accountable to real human needs."
          className="mb-2"
        />
        <dl className="grid gap-x-12 md:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <div key={audience.label} className="border-b border-border py-6">
              <dt className="font-display flex items-end gap-2 text-2xl">
                {audience.label}
                {/* Restates what /join-us says in full; the note never carries
                    anything the site does not state as real text. */}
                {audience.label === 'Students' && <MarginNote>no prerequisites</MarginNote>}
              </dt>
              <dd className="mt-2 text-pretty text-muted-foreground">{audience.text}</dd>
            </div>
          ))}
        </dl>
        <div className={cn(heroActions, 'mt-10')}>
          <PrimaryLink href="/join-us">Join the lab</PrimaryLink>
          <TextLink href="/contact" className={secondaryAction}>
            Start a collaboration
          </TextLink>
        </div>
      </section>
    </>
  )
}
