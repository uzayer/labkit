'use client'

import Link from 'next/link'
import { IconMicroscope } from '@tabler/icons-react'

import { NavGroup } from '@/components/dashboard/nav-group'
import { NavUser, type DashboardUser } from '@/components/dashboard/nav-user'
import { sidebarData, type DashboardNavGroup } from '@/components/dashboard/sidebar-data'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'

const fallbackUser: DashboardUser = {
  name: 'Lab Admin',
  email: 'admin@labkit.local',
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: DashboardUser
  labName?: string
  labTagline?: string
  navGroups?: DashboardNavGroup[]
}

export function AppSidebar({
  user = fallbackUser,
  labName = 'LabKit',
  labTagline = 'Research operations',
  navGroups = sidebarData,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-3 p-3">
        <Link
          href="/dashboard"
          className="hover:bg-sidebar-accent/70 border-sidebar-border/60 bg-sidebar-accent/30 flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <IconMicroscope className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{labName}</div>
            <div className="text-sidebar-foreground/70 truncate text-xs">{labTagline}</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
