'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

import {
  cancelImport,
  getRunStatus,
  startImport,
} from '@/app/_dashboard-legacy/dashboard/actions/imports'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ImportRun } from '@/payload-types'

const POLL_INTERVAL_MS = 2000

interface DisplayCandidate {
  key: string
  title: string
  year?: number
  doi?: string
  note?: string
  selected: boolean
  status: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseCandidates(value: ImportRun['candidates']): DisplayCandidate[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((entry) => {
    if (!isRecord(entry) || typeof entry.key !== 'string' || typeof entry.title !== 'string') {
      return []
    }
    return [
      {
        key: entry.key,
        title: entry.title,
        year: typeof entry.year === 'number' ? entry.year : undefined,
        doi: typeof entry.doi === 'string' ? entry.doi : undefined,
        note: typeof entry.note === 'string' ? entry.note : undefined,
        selected: entry.selected !== false,
        status: typeof entry.status === 'string' ? entry.status : 'pending',
      },
    ]
  })
}

function isTerminal(status: ImportRun['status']): boolean {
  return status === 'completed' || status === 'failed' || status === 'cancelled'
}

interface StagedSelectionProps {
  run: ImportRun
  onStarted: () => void
}

function StagedSelection({ run, onStarted }: StagedSelectionProps) {
  const candidates = React.useMemo(() => parseCandidates(run.candidates), [run.candidates])
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    () => new Set(candidates.filter((c) => c.selected).map((c) => c.key)),
  )
  const [isPending, startTransition] = React.useTransition()

  const toggle = (key: string, checked: boolean) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (checked) next.add(key)
      else next.delete(key)
      return next
    })
  }

  const toggleAll = (checked: boolean) => {
    setSelectedKeys(checked ? new Set(candidates.map((c) => c.key)) : new Set())
  }

  const handleStart = () => {
    startTransition(async () => {
      const result = await startImport(run.id, Array.from(selectedKeys))
      if (!result.success) {
        toast.error(result.error ?? 'Failed to start import')
        return
      }
      toast.success('Import started')
      onStarted()
    })
  }

  const allSelected = candidates.length > 0 && selectedKeys.size === candidates.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedKeys.size} of {candidates.length} candidates selected
        </p>
        <Button onClick={handleStart} disabled={isPending || selectedKeys.size === 0}>
          {isPending ? 'Starting…' : 'Start Import'}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>DOI</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length ? (
              candidates.map((candidate) => (
                <TableRow key={candidate.key}>
                  <TableCell>
                    <Checkbox
                      checked={selectedKeys.has(candidate.key)}
                      onCheckedChange={(checked) => toggle(candidate.key, checked === true)}
                    />
                  </TableCell>
                  <TableCell className="max-w-md text-sm">{candidate.title}</TableCell>
                  <TableCell className="text-sm">{candidate.year ?? '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {candidate.doi ?? '—'}
                  </TableCell>
                  <TableCell className="max-w-xs text-xs text-muted-foreground">
                    {candidate.note ?? '—'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No candidates staged.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function RunningProgress({ run, onCancelled }: { run: ImportRun; onCancelled: () => void }) {
  const [isPending, startTransition] = React.useTransition()
  const total = run.progress?.total ?? 0
  const processed = run.progress?.processed ?? 0
  const percent = total > 0 ? Math.round((processed / total) * 100) : 0

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelImport(run.id)
      if (!result.success) {
        toast.error(result.error ?? 'Failed to cancel import')
        return
      }
      toast.success('Import cancelled')
      onCancelled()
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {processed} / {total} processed ({percent}%)
        </p>
        <Button variant="outline" disabled={isPending} onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      <Progress value={percent} />
      <div className="flex gap-4 text-sm">
        <span>Created: {run.progress?.created ?? 0}</span>
        <span>Skipped (existing): {run.progress?.skippedExisting ?? 0}</span>
        <span>Failed: {run.progress?.failed ?? 0}</span>
      </div>
    </div>
  )
}

function RunSummary({ run }: { run: ImportRun }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge
          variant={
            run.status === 'completed'
              ? 'default'
              : run.status === 'failed'
                ? 'destructive'
                : 'secondary'
          }
        >
          {run.status}
        </Badge>
      </div>
      <div className="flex gap-4 text-sm">
        <span>Total: {run.progress?.total ?? 0}</span>
        <span>Created: {run.progress?.created ?? 0}</span>
        <span>Skipped (existing): {run.progress?.skippedExisting ?? 0}</span>
        <span>Failed: {run.progress?.failed ?? 0}</span>
      </div>
      {run.status === 'failed' && run.error ? (
        <p className="text-sm text-destructive">{run.error}</p>
      ) : null}
      <Link href="/dashboard/review" className="text-sm underline">
        Open review queue
      </Link>
    </div>
  )
}

export interface RunDetailProps {
  initialRun: ImportRun
}

export function RunDetail({ initialRun }: RunDetailProps) {
  const [run, setRun] = React.useState<ImportRun>(initialRun)

  React.useEffect(() => {
    if (isTerminal(run.status)) return

    const interval = setInterval(async () => {
      const result = await getRunStatus(run.id)
      if ('error' in result) return
      setRun(result)
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [run.id, run.status])

  const refresh = React.useCallback(async () => {
    const result = await getRunStatus(run.id)
    if (!('error' in result)) setRun(result)
  }, [run.id])

  if (run.status === 'staged') {
    return <StagedSelection run={run} onStarted={refresh} />
  }

  if (run.status === 'running') {
    return <RunningProgress run={run} onCancelled={refresh} />
  }

  return <RunSummary run={run} />
}
