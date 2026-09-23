import type { Metadata } from 'next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Deliberately not a Payload `pages` document. This route is unlinked from
// nav and excluded from generateStaticParams' page list — it exists to be
// shared directly (Nova, referrals), not discovered. noindex is load-bearing
// here, not decorative: this page ships before DIAL is live, so it must not
// surface in search while it's making claims DIAL hasn't proven yet.
export const metadata: Metadata = {
  title: 'LabKit — early access',
  robots: {
    index: false,
    follow: false,
  },
}

const EMAIL = 'uzayermasud@gmail.com'
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('LabKit early access')}`

export default function LabKitEarlyAccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <Badge variant="secondary" className="mb-6">
        Early access — by request
      </Badge>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Your lab&apos;s website, built from data — not a template.
      </h1>

      <p className="mt-6 text-lg text-muted-foreground">
        Paste an ORCID iD or a citation list. LabKit turns it into a structured record of your
        lab&apos;s publications, people, grants, and awards — and generates a real website from that
        data, not the other way around.
      </p>

      <div className="mt-8">
        <Button render={<a href={MAILTO} />} size="lg" nativeButton={false} role="link">
          Request early access
        </Button>
      </div>

      <section className="mt-20">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          The actual pitch
        </h2>
        <p className="mt-4 text-base leading-relaxed">
          Lab websites survive while being ugly because they&apos;re good enough at the real jobs:
          proving credibility, listing publications, helping people find you. Making that prettier
          isn&apos;t worth switching for. What is worth it: your publications, grants, team, and
          awards become structured records once, and the website is just one thing built from that
          data. The same records are the foundation for reducing the manual admin work — reporting,
          CVs, grant paperwork — that eats a lab&apos;s time. That layer isn&apos;t built yet. The
          data layer and the website are.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          What&apos;s working today
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Import, don&apos;t retype</CardTitle>
              <CardDescription>
                An ORCID iD or a pasted citation list (the docx/PDF export most labs already have)
                gets resolved against Crossref and OpenAlex automatically — DOI, venue, co-authors,
                abstract.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Structured, not scraped</CardTitle>
              <CardDescription>
                Publications, Team, Grants, Awards, Projects, and Research Themes are real records
                with real relationships — not paragraphs of text pretending to be data.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">A real website, generated</CardTitle>
              <CardDescription>
                The public site is a direct rendering of that data — add a publication once, it
                appears everywhere it should, formatted correctly.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Concierge, not self-serve</CardTitle>
              <CardDescription>
                There is no signup flow. Early access means a real conversation, then a hands-on
                setup for your lab specifically.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mt-16 rounded-lg border border-dashed p-6">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Proof</h2>
        <p className="mt-3 text-base text-muted-foreground">
          DIAL Lab (North South University, Dr. Nova Ahmed) is the first real instance — launching
          soon. This section gets replaced with their site and a quote the day it&apos;s live, not
          before.
        </p>
      </section>

      <section className="mt-16">
        <Button render={<a href={MAILTO} />} size="lg" nativeButton={false} role="link">
          Request early access
        </Button>
      </section>
    </main>
  )
}
