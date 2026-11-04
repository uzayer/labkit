import { PrimaryLink, TextLink } from '@/components/site/links'
import { PageHeader } from '@/components/site/page-header'
import { PublicationList } from '@/components/site/publication-list'
import { NewsList, ThemeList } from '@/components/site/record-lists'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'
import { label } from '@/lib/site/typography'

export default async function HomePage() {
  const site = await getSite()
  const { labInfo, features, researchThemes, publications, news, listedTeam } = site

  // Featured publications, or the most recent five when none are marked.
  const featured = publications.filter((pub) => pub.featured)
  const selected = (featured.length > 0 ? featured : publications).slice(0, 5)
  // Featured themes lead when the Lab has marked any; otherwise all of them.
  const featuredThemes = researchThemes.filter((theme) => theme.featured)
  const themes = (featuredThemes.length > 0 ? featuredThemes : researchThemes).slice(0, 6)
  const partners = site.organizationsIn(labInfo.homePartners)
  const institution = [labInfo.parentOrganization?.department, labInfo.parentOrganization?.name]
    .filter(Boolean)
    .join(', ')
  const isEmpty = publications.length === 0 && listedTeam.length === 0

  return (
    <>
      <PageHeader
        // The name moves up to the label when the headline takes the title.
        eyebrow={[labInfo.headline && labInfo.name, institution].filter(Boolean).join(' · ')}
        title={labInfo.headline || site.labName}
        description={labInfo.intro || labInfo.description}
        facts={[
          { value: String(publications.length), label: 'Publications' },
          {
            value: String(listedTeam.filter((p) => p.role !== 'alumni').length),
            label: 'People',
          },
          ...(features.projects
            ? [{ value: String(site.projects.length), label: 'Projects' }]
            : []),
        ]}
      >
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
          <PrimaryLink href={features.researchThemes ? '/research' : '/publications'}>
            Explore the research
          </PrimaryLink>
          <TextLink href="/join-us">Join the lab</TextLink>
        </div>
        {partners.length > 0 && (
          <div className="mt-12 border-t border-border pt-6">
            <p className={label}>In collaboration with</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {partners.map((org) => (
                <li key={org.id}>{org.name}</li>
              ))}
            </ul>
          </div>
        )}
      </PageHeader>

      {isEmpty && (
        <Section first title="This site fills itself in">
          <EmptyState>
            Nothing has been added yet. Publications, people, Research Themes and news appear here
            as they are added in the admin panel.
          </EmptyState>
        </Section>
      )}

      {features.researchThemes && themes.length > 0 && (
        <Section
          first={!isEmpty}
          label="Research"
          title="What we work on"
          link={{ text: 'All research themes', href: '/research' }}
        >
          <ThemeList site={site} themes={themes} />
        </Section>
      )}

      {selected.length > 0 && (
        <Section
          label="Publications"
          title={featured.length > 0 ? 'Selected work' : 'Recent work'}
          link={{ text: 'All publications', href: '/publications' }}
        >
          <PublicationList site={site} publications={selected} showYear />
        </Section>
      )}

      {features.newsItems && news.length > 0 && (
        <Section label="News" title="Lately" link={{ text: 'All news', href: '/news' }}>
          <NewsList items={news.slice(0, 3)} />
        </Section>
      )}
    </>
  )
}
