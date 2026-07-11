import { ImportWizard } from './import-wizard'

export default function ImportPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Ingestion
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Import Publications</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Pull works from an ORCID iD, paste BibTeX or a citation wall, or add a single DOI
          directly. ORCID, BibTeX, and citation imports stage a candidate list you review and select
          before anything is created — DOI quick-add runs immediately.
        </p>
      </div>
      <ImportWizard />
    </main>
  )
}
