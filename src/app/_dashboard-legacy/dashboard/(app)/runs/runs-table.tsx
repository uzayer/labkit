'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ImportRun } from '@/payload-types'
import { DataTablePagination } from '@/components/dashboard/data-table/pagination'

const SOURCE_LABELS: Record<ImportRun['source'], string> = {
  orcid: 'ORCID',
  bibtex: 'BibTeX',
  citations: 'Citation paste',
  doi: 'DOI quick-add',
  cli: 'CLI',
}

const STATUS_VARIANTS: Record<
  ImportRun['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  staged: 'outline',
  running: 'secondary',
  completed: 'default',
  failed: 'destructive',
  cancelled: 'secondary',
}

function formatDate(value?: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function progressSummary(run: ImportRun): string {
  const progress = run.progress
  if (!progress) return '—'
  return `${progress.processed ?? 0}/${progress.total ?? 0} processed`
}

interface RunsTableProps {
  rows: ImportRun[]
  page: number
  pageSize: number
  pageCount: number
  totalDocs: number
}

export function RunsTable({ rows, page, pageSize, pageCount, totalDocs }: RunsTableProps) {
  const router = useRouter()

  function navigate(next: { page?: number; pageSize?: number }) {
    const nextPage = next.page ?? page
    const nextPageSize = next.pageSize ?? pageSize
    const params = new URLSearchParams()
    params.set('page', String(nextPage))
    params.set('pageSize', String(nextPageSize))
    router.push(`/dashboard/runs?${params.toString()}`)
  }

  const columns = React.useMemo<ColumnDef<ImportRun>[]>(
    () => [
      {
        accessorKey: 'label',
        header: 'Label',
        cell: ({ row }) => (
          <Link
            href={`/dashboard/import/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.label}
          </Link>
        ),
      },
      {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => <Badge variant="secondary">{SOURCE_LABELS[row.original.source]}</Badge>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={STATUS_VARIANTS[row.original.status]}>{row.original.status}</Badge>
        ),
      },
      {
        id: 'progress',
        header: 'Progress',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{progressSummary(row.original)}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      pagination: { pageIndex: Math.max(page - 1, 0), pageSize },
    },
    manualPagination: true,
    pageCount: pageCount || 1,
    onPaginationChange: (updater) => {
      const current = { pageIndex: Math.max(page - 1, 0), pageSize }
      const next = typeof updater === 'function' ? updater(current) : updater
      const nextPageSize = next.pageSize
      const nextPage = nextPageSize !== pageSize ? 1 : next.pageIndex + 1
      navigate({ page: nextPage, pageSize: nextPageSize })
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No import runs yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{totalDocs} total</p>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
