import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { ImportRun } from '@/payload-types'

import { RunDetail } from './run-detail'

interface RunDetailPageProps {
  params: Promise<{ runId: string }>
}

async function loadRun(runId: string): Promise<ImportRun | null> {
  const payload = await getPayload({ config: configPromise })

  try {
    return await payload.findByID({
      collection: 'import-runs',
      id: runId,
      overrideAccess: true,
    })
  } catch {
    return null
  }
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const { runId } = await params
  const run = await loadRun(runId)

  if (!run) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-[0.24em] uppercase">
          Ingestion
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{run.label}</h1>
      </div>
      <RunDetail initialRun={run} />
    </main>
  )
}
