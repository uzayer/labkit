'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconChevronRight } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  type DashboardNavGroup as DashboardNavGroupData,
  type DashboardNavItem,
  type DashboardNavLeafItem,
} from '@/components/dashboard/sidebar-data'

export interface NavGroupProps extends DashboardNavGroupData {}

export function NavGroup({ title, items }: NavGroupProps) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(pathname, item)

          if (hasChildren(item)) {
            return (
              <Collapsible
                key={item.title}
                render={<SidebarMenuItem />}
                defaultOpen={active}
                className="group/collapsible"
              >
                <CollapsibleTrigger
                  render={<SidebarMenuButton tooltip={item.title} isActive={active} />}
                >
                  {item.icon ? <item.icon /> : null}
                  <span>{item.title}</span>
                  {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
                  <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          render={<Link href={subItem.url} onClick={() => setOpenMobile(false)} />}
                          isActive={isLeafActive(pathname, subItem)}
                        >
                          {subItem.icon ? <subItem.icon /> : null}
                          <span>{subItem.title}</span>
                          {subItem.badge ? <NavBadge>{subItem.badge}</NavBadge> : null}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={<Link href={item.url} onClick={() => setOpenMobile(false)} />}
                tooltip={item.title}
                isActive={active}
              >
                {item.icon ? <item.icon /> : null}
                <span>{item.title}</span>
                {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: React.ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-[10px]">{children}</Badge>
}

function hasChildren(
  item: DashboardNavItem,
): item is Extract<DashboardNavItem, { items: DashboardNavLeafItem[] }> {
  return 'items' in item
}

function isItemActive(pathname: string, item: DashboardNavItem) {
  if (hasChildren(item)) {
    return item.items.some((subItem) => isLeafActive(pathname, subItem))
  }

  return isLeafActive(pathname, item)
}

function isLeafActive(pathname: string, item: DashboardNavLeafItem) {
  const normalizedPath = pathname.split('?')[0]

  if (item.url === '/dashboard') {
    return normalizedPath === item.url
  }

  return normalizedPath === item.url || normalizedPath.startsWith(`${item.url}/`)
}
