'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowRightDashed, IconSearch } from '@tabler/icons-react'

import { sidebarData } from '@/components/dashboard/sidebar-data'
import { useSearch } from '@/components/dashboard/search-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CommandMenu() {
  const router = useRouter()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen],
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search dashboard destinations..." />
      <CommandList>
        <ScrollArea className="h-80">
          <CommandEmpty>No matching pages found.</CommandEmpty>
          {sidebarData.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.flatMap((item) => {
                if ('url' in item) {
                  return (
                    <CommandItem
                      key={item.url}
                      value={item.title}
                      onSelect={() => runCommand(() => router.push(item.url))}
                    >
                      {item.icon ? (
                        <item.icon className="text-muted-foreground" />
                      ) : (
                        <IconSearch className="text-muted-foreground" />
                      )}
                      <span>{item.title}</span>
                    </CommandItem>
                  )
                }

                return item.items.map((subItem) => (
                  <CommandItem
                    key={subItem.url}
                    value={`${item.title} ${subItem.title}`}
                    onSelect={() => runCommand(() => router.push(subItem.url))}
                  >
                    {subItem.icon ? (
                      <subItem.icon className="text-muted-foreground" />
                    ) : (
                      <IconArrowRightDashed className="text-muted-foreground" />
                    )}
                    <span>{subItem.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{item.title}</span>
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
