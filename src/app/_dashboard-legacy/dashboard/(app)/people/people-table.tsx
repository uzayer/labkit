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
import { toast } from 'sonner'

import type { Team } from '@/payload-types'
import { DataTableColumnHeader } from '@/components/dashboard/data-table/column-header'
import { DataTablePagination } from '@/components/dashboard/data-table/pagination'
import { DataTableToolbar } from '@/components/dashboard/data-table/toolbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { toggleTeamDisplayInWebsite } from '../../actions/people'

export type PeopleTab = 'members' | 'everyone' | 'needs-review'

const ROLE_LABELS: Record<string, string> = {
  director: 'Director',
  faculty: 'Faculty Member',
  'graduate-ra': 'Graduate RA',
  'undergraduate-ra': 'Undergraduate RA',
  alumni: 'Alumni',
  'interdisciplinary-collaborator': 'Interdisciplinary Collaborator',
  'external-collaborator': 'External Collaborator',
}

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))
const SOURCE_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'import', label: 'Import' },
]

interface PeopleTableProps {
  rows: Team[]
  tab: PeopleTab
  page: number
  pageSize: number
  pageCount: number
  totalDocs: number
  counts: { members: number; everyone: number; needsReview: number }
}

function affiliationLabel(row: Team): string {
  if (row.affiliation && typeof row.affiliation === 'object') return row.affiliation.name
  return row.affiliationLabel ?? '—'
}

function photoUrl(row: Team): string | undefined {
  if (row.photo && typeof row.photo === 'object') return row.photo.url ?? undefined
  return undefined
}

export function PeopleTable({
  rows,
  tab,
  page,
  pageSize,
  pageCount,
  totalDocs,
  counts,
}: PeopleTableProps) {
  const router = useRouter()
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  function navigate(next: { tab?: PeopleTab; page?: number; pageSize?: number }) {
    const nextTab = next.tab ?? tab
    const nextPage = next.page ?? page
    const nextPageSize = next.pageSize ?? pageSize
    const params = new URLSearchParams()
    params.set('tab', nextTab)
    params.set('page', String(nextPage))
    params.set('pageSize', String(nextPageSize))
    router.push(`/dashboard/people?${params.toString()}`)
  }

  async function handleToggle(row: Team, next: boolean) {
    setPendingId(row.id)
    const result = await toggleTeamDisplayInWebsite(row.id, next)
    setPendingId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to update team member')
      return
    }
    const label = row.name ?? row.title
    toast.success(next ? `${label} now shows on the website` : `${label} hidden from the website`)
    router.refresh()
  }

  const columns = React.useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
          const person = row.original
          const url = photoUrl(person)
          const displayName = person.name ?? `${person.firstName} ${person.lastName}`
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {url ? <AvatarImage src={url} alt={displayName} /> : null}
                <AvatarFallback className="text-xs">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link
                  href={`/admin/collections/team/${person.id}`}
                  className="font-medium hover:underline"
                >
                  {displayName}
                </Link>
                <span className="text-muted-foreground text-xs">{person.title}</span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => (
          <Badge variant="secondary">{ROLE_LABELS[row.original.role] ?? row.original.role}</Badge>
        ),
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id) as string),
      },
      {
        id: 'affiliation',
        header: 'Affiliation',
        cell: ({ row }) => <span className="text-sm">{affiliationLabel(row.original)}</span>,
      },
      {
        accessorKey: 'source',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
        cell: ({ row }) => (
          <Badge variant={row.original.source === 'import' ? 'outline' : 'secondary'}>
            {row.original.source === 'import' ? 'Import' : 'Manual'}
          </Badge>
        ),
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id) as string),
      },
      {
        id: 'displayInWebsite',
        header: 'On website',
        cell: ({ row }) => (
          <Switch
            checked={row.original.displayInWebsite ?? false}
            disabled={pendingId === row.original.id}
            onCheckedChange={(checked) => handleToggle(row.original, checked)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pendingId],
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
      <Tabs value={tab} onValueChange={(next) => navigate({ tab: next as PeopleTab, page: 1 })}>
        <TabsList>
          <TabsTrigger value="members">Members ({counts.members})</TabsTrigger>
          <TabsTrigger value="everyone">Everyone ({counts.everyone})</TabsTrigger>
          <TabsTrigger value="needs-review">Needs review ({counts.needsReview})</TabsTrigger>
        </TabsList>
      </Tabs>
      <DataTableToolbar
        table={table}
        searchColumn="name"
        searchPlaceholder="Filter loaded rows by name..."
        filters={[
          { columnId: 'role', title: 'Role', options: ROLE_OPTIONS },
          { columnId: 'source', title: 'Source', options: SOURCE_OPTIONS },
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
                  No people found.
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
