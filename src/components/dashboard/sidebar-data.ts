import {
  IconBook2,
  IconDatabaseImport,
  IconFileDescription,
  IconFileText,
  IconHome2,
  IconSettings2,
  IconUsers,
  type Icon,
} from '@tabler/icons-react'

export interface DashboardNavLeafItem {
  title: string
  url: string
  badge?: string
  icon?: Icon
}

export interface DashboardNavParentItem {
  title: string
  badge?: string
  icon?: Icon
  items: DashboardNavLeafItem[]
}

export type DashboardNavItem = DashboardNavLeafItem | DashboardNavParentItem

export interface DashboardNavGroup {
  title: string
  items: DashboardNavItem[]
}

export const sidebarData: DashboardNavGroup[] = [
  {
    title: 'Workspace',
    items: [
      {
        title: 'Dashboard Home',
        url: '/dashboard',
        icon: IconHome2,
      },
    ],
  },
  {
    title: 'Ingestion',
    items: [
      {
        title: 'Import',
        icon: IconDatabaseImport,
        items: [
          {
            title: 'New Import',
            url: '/dashboard/import',
          },
          {
            title: 'Runs',
            url: '/dashboard/runs',
            icon: IconFileDescription,
          },
          {
            title: 'Review',
            url: '/dashboard/review',
            icon: IconFileText,
          },
        ],
      },
    ],
  },
  {
    title: 'Research Directory',
    items: [
      {
        title: 'People',
        url: '/dashboard/people',
        icon: IconUsers,
      },
      {
        title: 'Publications',
        url: '/dashboard/publications',
        icon: IconBook2,
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: IconSettings2,
      },
    ],
  },
]
