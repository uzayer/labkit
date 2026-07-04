'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { IconX } from '@tabler/icons-react'

import {
  DataTableFacetedFilter,
  type DataTableFacetedFilterOption,
} from '@/components/dashboard/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/dashboard/data-table/view-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface DataTableToolbarFilter {
  columnId: string
  title: string
  options: DataTableFacetedFilterOption[]
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumn?: string
  searchPlaceholder?: string
  filters?: DataTableToolbarFilter[]
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = 'Filter results...',
  filters = [],
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const searchTarget = searchColumn ? table.getColumn(searchColumn) : undefined

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 flex-col-reverse items-start gap-2 sm:flex-row sm:items-center">
        {searchTarget ? (
          <Input
            placeholder={searchPlaceholder}
            value={(searchTarget.getFilterValue() as string) ?? ''}
            onChange={(event) => searchTarget.setFilterValue(event.target.value)}
            className="h-8 w-full sm:w-[180px] lg:w-[280px]"
          />
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)

            if (!column) {
              return null
            }

            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
          {children}
        </div>
        {isFiltered ? (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <IconX className="ml-2 size-4" />
          </Button>
        ) : null}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
