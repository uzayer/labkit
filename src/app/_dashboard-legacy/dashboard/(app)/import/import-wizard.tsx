'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { quickAddDoi, stageImport } from '@/app/_dashboard-legacy/dashboard/actions/imports'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type WizardSource = 'orcid' | 'bibtex' | 'citations' | 'doi'

const SOURCE_CARDS: Array<{ id: WizardSource; title: string; description: string }> = [
  {
    id: 'orcid',
    title: 'ORCID',
    description: "Pull every work on a researcher's ORCID record.",
  },
  {
    id: 'bibtex',
    title: 'BibTeX upload',
    description: 'Paste .bib entries exported from a reference manager.',
  },
  {
    id: 'citations',
    title: 'Citation paste',
    description: 'Paste a citation wall (CV or website list) grouped by blank lines.',
  },
  {
    id: 'doi',
    title: 'DOI quick-add',
    description: 'Add a single publication immediately by DOI — no review step.',
  },
]

function OrcidForm() {
  const router = useRouter()
  const [orcidId, setOrcidId] = React.useState('')
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    startTransition(async () => {
      const result = await stageImport('orcid', { orcidId })
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      router.push(`/dashboard/import/${result.runId}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="orcid-id">ORCID iD</Label>
        <Input
          id="orcid-id"
          placeholder="0000-0002-1825-0097"
          value={orcidId}
          onChange={(event) => setOrcidId(event.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isPending || !orcidId.trim()}>
        {isPending ? 'Fetching…' : 'Fetch works'}
      </Button>
    </form>
  )
}

function BibtexForm() {
  const router = useRouter()
  const [bibtexText, setBibtexText] = React.useState('')
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    startTransition(async () => {
      const result = await stageImport('bibtex', { bibtexText })
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      router.push(`/dashboard/import/${result.runId}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="bibtex-text">BibTeX entries</Label>
        <Textarea
          id="bibtex-text"
          placeholder="@article{smith2024, title={...}, ...}"
          className="min-h-[180px] font-mono text-xs"
          value={bibtexText}
          onChange={(event) => setBibtexText(event.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isPending || !bibtexText.trim()}>
        {isPending ? 'Parsing…' : 'Parse entries'}
      </Button>
    </form>
  )
}

function CitationsForm() {
  const router = useRouter()
  const [citationText, setCitationText] = React.useState('')
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    startTransition(async () => {
      const result = await stageImport('citations', { citationText })
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      router.push(`/dashboard/import/${result.runId}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="citation-text">Citation wall</Label>
        <Textarea
          id="citation-text"
          placeholder={
            'Smith, J. (2024). Title of paper. Venue.\n\nDoe, A. (2023). Another paper. Venue.'
          }
          className="min-h-[180px] text-sm"
          value={citationText}
          onChange={(event) => setCitationText(event.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isPending || !citationText.trim()}>
        {isPending ? 'Parsing…' : 'Parse citations'}
      </Button>
    </form>
  )
}

function DoiForm() {
  const [doi, setDoi] = React.useState('')
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    startTransition(async () => {
      const result = await quickAddDoi(doi)
      if (result.error) {
        toast.error(result.error)
        return
      }
      const description =
        result.reviewCount && result.reviewCount > 0 ? (
          <span>
            {result.reviewCount} item(s) need review —{' '}
            <Link href="/dashboard/review" className="underline">
              open review queue
            </Link>
          </span>
        ) : undefined
      toast.success(
        result.title ? `${result.action}: ${result.title}` : `Import ${result.action}`,
        description ? { description } : undefined,
      )
      setDoi('')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="doi">DOI</Label>
        <Input
          id="doi"
          placeholder="10.1145/3313831.3376727"
          value={doi}
          onChange={(event) => setDoi(event.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isPending || !doi.trim()}>
        {isPending ? 'Adding…' : 'Add publication'}
      </Button>
    </form>
  )
}

function SourceForm({ source }: { source: WizardSource }) {
  if (source === 'orcid') return <OrcidForm />
  if (source === 'bibtex') return <BibtexForm />
  if (source === 'citations') return <CitationsForm />
  return <DoiForm />
}

export function ImportWizard() {
  const [activeSource, setActiveSource] = React.useState<WizardSource | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SOURCE_CARDS.map((card) => (
          <Card
            key={card.id}
            className={
              activeSource === card.id
                ? 'ring-primary cursor-pointer ring-2'
                : 'cursor-pointer transition-shadow hover:shadow-md'
            }
            onClick={() => setActiveSource(card.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {activeSource ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {SOURCE_CARDS.find((card) => card.id === activeSource)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SourceForm source={activeSource} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
