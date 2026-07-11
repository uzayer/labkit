'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { toast } from 'sonner'

import {
  acceptReviewItem,
  dismissReviewItem,
  mergePersonSuggestion,
} from '@/app/_dashboard-legacy/dashboard/actions/review'
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog'
import { DataTableColumnHeader } from '@/components/dashboard/data-table/column-header'
import { DataTablePagination } from '@/components/dashboard/data-table/pagination'
import { DataTableToolbar } from '@/components/dashboard/data-table/toolbar'
import { LongText } from '@/components/dashboard/long-text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ImportRun, ReviewItem } from '@/payload-types'

type ReviewItemKind = ReviewItem['kind']

const KIND_LABELS: Record<ReviewItemKind, string> = {
  'unmatched-venue': 'Unmatched venue',
  'unmatched-org': 'Unmatched organization',
  'person-merge-suggestion': 'Person merge suggestion',
  'no-doi-work': 'No-DOI work',
  'unparsed-citation': 'Unparsed citation',
  'unmapped-type': 'Unmapped type',
  'failed-doi': 'Failed DOI',
}

const KIND_ORDER: ReviewItemKind[] = [
  'person-merge-suggestion',
  'unmatched-venue',
  'unmatched-org',
  'no-doi-work',
  'unparsed-citation',
  'unmapped-type',
  'failed-doi',
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function runLabel(run: ReviewItem['run']): string {
  if (!run) return '—'
  if (typeof run === 'string') return run
  return (run as ImportRun).label ?? '—'
}

interface RowActionsProps {
  item: ReviewItem
  onDone: () => void
}

function RowActions({ item, onDone }: RowActionsProps) {
  const [isPending, startTransition] = React.useTransition()
  const [mergeDialogOpen, setMergeDialogOpen] = React.useState(false)

  const runAction = (action: () => Promise<{ success: boolean; error?: string }>) => {
    startTransition(async () => {
      const result = await action()
      if (result.success) {
        toast.success('Review item updated')
        onDone()
      } else {
        toast.error(result.error ?? 'Action failed')
      }
    })
  }

  const handleDismiss = () => runAction(() => dismissReviewItem(item.id))

  const handleAccept = () => {
    if (item.kind === 'person-merge-suggestion') {
      setMergeDialogOpen(true)
      return
    }
    runAction(() => acceptReviewItem(item.id))
  }

  const handleConfirmMerge = () => {
    setMergeDialogOpen(false)
    runAction(() => mergePersonSuggestion(item.id))
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button size="sm" variant="outline" disabled={isPending} onClick={handleAccept}>
        {item.kind === 'person-merge-suggestion' ? 'Merge' : 'Accept'}
      </Button>
      <Button size="sm" variant="ghost" disabled={isPending} onClick={handleDismiss}>
        Dismiss
      </Button>
      <ConfirmDialog
        open={mergeDialogOpen}
        onOpenChange={setMergeDialogOpen}
        title="Merge duplicate Team record?"
        desc="This re-points every publication author entry pointing at the newly created Team record onto the existing one, then permanently deletes the duplicate. This cannot be undone."
        destructive
        confirmText="Merge & delete duplicate"
        isLoading={isPending}
        handleConfirm={handleConfirmMerge}
      />
    </div>
  )
}

function buildColumns(onDone: () => void): ColumnDef<ReviewItem>[] {
  return [
    {
      accessorKey: 'kind',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kind" />,
      cell: ({ row }) => <Badge variant="secondary">{KIND_LABELS[row.original.kind]}</Badge>,
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'value',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
      cell: ({ row }) => <LongText className="max-w-md text-sm">{row.original.value}</LongText>,
    },
    {
      accessorKey: 'sourceContext',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Source context" />,
      cell: ({ row }) => (
        <LongText className="max-w-xs text-sm text-muted-foreground">
          {row.original.sourceContext || '—'}
        </LongText>
      ),
    },
    {
      id: 'run',
      accessorFn: (row) => runLabel(row.run),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Run" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{runLabel(row.original.run)}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Flagged" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => <RowActions item={row.original} onDone={onDone} />,
      enableSorting: false,
      enableHiding: false,
    },
  ]
}

export interface ReviewQueueTableProps {
  initialItems: ReviewItem[]
}

export function ReviewQueueTable({ initialItems }: ReviewQueueTableProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'all' | ReviewItemKind>('all')

  const handleDone = React.useCallback(() => {
    router.refresh()
  }, [router])

  const columns = React.useMemo(() => buildColumns(handleDone), [handleDone])

  const counts = React.useMemo(() => {
    const acc: Record<string, number> = { all: initialItems.length }
    for (const kind of KIND_ORDER) {
      acc[kind] = initialItems.filter((item) => item.kind === kind).length
    }
    return acc
  }, [initialItems])

  const data = React.useMemo(() => {
    if (activeTab === 'all') return initialItems
    return initialItems.filter((item) => item.kind === activeTab)
  }, [initialItems, activeTab])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:bg-muted">
            All ({counts.all})
          </TabsTrigger>
          {KIND_ORDER.map((kind) => (
            <TabsTrigger key={kind} value={kind} className="data-[state=active]:bg-muted">
              {KIND_LABELS[kind]} ({counts[kind] ?? 0})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DataTableToolbar table={table} searchColumn="value" searchPlaceholder="Filter by value..." />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No open review items in this category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
