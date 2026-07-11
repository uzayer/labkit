'use client'

import * as React from 'react'
import { IconSearch } from '@tabler/icons-react'

import { useOptionalSearch } from '@/components/dashboard/search-provider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/utils'

export interface HeaderProps extends Omit<React.ComponentProps<'header'>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

export function Header({ title, description, actions, className, ...props }: HeaderProps) {
  const search = useOptionalSearch()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur',
        className,
      )}
      {...props}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      {(title || description) && (
        <div className="min-w-0">
          {title ? <div className="truncate text-sm font-semibold">{title}</div> : null}
          {description ? (
            <div className="truncate text-xs text-muted-foreground">{description}</div>
          ) : null}
        </div>
      )}
      <div className="ml-auto flex items-center gap-2">
        {search ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            onClick={() => search.setOpen(true)}
          >
            <IconSearch className="size-4" />
            <span className="hidden sm:inline">Search</span>
            <span className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline-flex">
              Ctrl K
            </span>
          </Button>
        ) : null}
        {actions}
      </div>
    </header>
  )
}
