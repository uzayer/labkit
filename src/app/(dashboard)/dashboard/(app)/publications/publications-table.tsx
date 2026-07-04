'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type { Publication } from '@/payload-types'
import { DataTableColumnHeader } from '@/components/dashboard/data-table/column-header'
import { DataTablePagination } from '@/components/dashboard/data-table/pagination'
import { DataTableToolbar } from '@/components/dashboard/data-table/toolbar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const TYPE_OPTIONS = [
  { value: 'conference', label: 'Conference' },
  { value: 'journal', label: 'Journal' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'preprint', label: 'Preprint' },
  { value: 'extended-abstract', label: 'Extended Abstract' },
  { value: 'study-protocol', label: 'Study Protocol' },
  { value: 'book-chapter', label: 'Book Chapter' },
]

const SOURCE_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'crossref', label: 'Crossref' },
  { value: 'openalex', label: 'OpenAlex' },
  { value: 'bibtex', label: 'BibTeX' },
  { value: 'scrape', label: 'Scrape' },
]

interface PublicationsTableProps {
  rows: Publication[]
  page: number
  pageSize: number
  pageCount: number
  totalDocs: number
}

export function PublicationsTable({
  rows,
  page,
  pageSize,
  pageCount,
  totalDocs,
}: PublicationsTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  function navigate(next: { page?: number; pageSize?: number }) {
    const nextPage = next.page ?? page
    const nextPageSize = next.pageSize ?? pageSize
    const params = new URLSearchParams()
    params.set('page', String(nextPage))
    params.set('pageSize', String(nextPageSize))
    router.push(`/dashboard/publications?${params.toString()}`)
  }

  const columns = React.useMemo<ColumnDef<Publication>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => (
          <Link
            href={`/admin/collections/publications/${row.original.id}`}
            className="line-clamp-2 max-w-md font-medium hover:underline"
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: 'year',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Year" />,
      },
      {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) =>
          row.original.type ? (
            <Badge variant="secondary">
              {TYPE_OPTIONS.find((option) => option.value === row.original.type)?.label ??
                row.original.type}
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id) as string),
      },
      {
        accessorKey: 'venueLabel',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Venue" />,
        cell: ({ row }) =>
          row.original.venueLabel ?? <span className="text-muted-foreground">—</span>,
      },
      {
        id: 'authorCount',
        header: 'Authors',
        cell: ({ row }) => row.original.authors?.length ?? 0,
      },
      {
        id: 'provenanceSource',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
        accessorFn: (row) => row.provenance?.source ?? 'manual',
        cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id) as string),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex: Math.max(page - 1, 0), pageSize },
    },
    manualPagination: true,
    pageCount: pageCount || 1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const current = { pageIndex: Math.max(page - 1, 0), pageSize }
      const next = typeof updater === 'function' ? updater(current) : updater
      const nextPageSize = next.pageSize
      const nextPage = nextPageSize !== pageSize ? 1 : next.pageIndex + 1
      navigate({ page: nextPage, pageSize: nextPageSize })
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        table={table}
        searchColumn="title"
        searchPlaceholder="Filter loaded rows by title..."
        filters={[
          { columnId: 'type', title: 'Type', options: TYPE_OPTIONS },
          { columnId: 'provenanceSource', title: 'Source', options: SOURCE_OPTIONS },
        ]}
      />
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
                  className="text-muted-foreground h-24 text-center"
                >
                  No publications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">{totalDocs} total</p>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
