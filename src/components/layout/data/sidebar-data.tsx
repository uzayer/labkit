import {
  IconApps,
  IconBarrierBlock,
  IconBug,
  IconChecklist,
  IconCode,
  IconCoin,
  IconError404,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconNotification,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUser,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, GalleryVerticalEnd } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'ausrobdev',
    email: 'rob@shadcnblocks.com',
    avatar: '/avatars/ausrobdev-avatar.png',
  },
  teams: [
    {
      name: 'Shadcnblocks - Admin Kit',
      logo: ({ className }: { className: string }) => (
        <Logo className={cn('invert dark:invert-0', className)} />
      ),
      plan: 'Nextjs + shadcn/ui',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          icon: IconLayoutDashboard,
          items: [
            {
              title: 'Dashboard 1',
              url: '/dashboard',
            },
            {
              title: 'Dashboard 2',
              url: '/dashboard/dashboard-2',
            },
            {
              title: 'Dashboard 3',
              url: '/dashboard/dashboard-3',
            },
          ],
        },
        {
          title: 'Tasks',
          url: '/dashboard/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Users',
          url: '/dashboard/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Login',
              url: '/dashboard/login',
            },
            {
              title: 'Register',
              url: '/dashboard/register',
            },
            {
              title: 'Forgot Password',
              url: '/dashboard/forgot-password',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/dashboard/401',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/dashboard/403',
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: '/dashboard/404',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/dashboard/error',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/dashboard/503',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'General',
              icon: IconTool,
              url: '/dashboard/settings',
            },
            {
              title: 'Profile',
              icon: IconUser,
              url: '/dashboard/settings/profile',
            },
            {
              title: 'Billing',
              icon: IconCoin,
              url: '/dashboard/settings/billing',
            },
            {
              title: 'Plans',
              icon: IconChecklist,
              url: '/dashboard/settings/plans',
            },
            {
              title: 'Connected Apps',
              icon: IconApps,
              url: '/dashboard/settings/connected-apps',
            },
            {
              title: 'Notifications',
              icon: IconNotification,
              url: '/dashboard/settings/notifications',
            },
          ],
        },
        {
          title: 'Developers',
          icon: IconCode,
          items: [
            {
              title: 'Overview',
              url: '/dashboard/developers/overview',
            },
            {
              title: 'API Keys',
              url: '/dashboard/developers/api-keys',
            },
            {
              title: 'Webhooks',
              url: '/dashboard/developers/webhooks',
            },
            {
              title: 'Events/Logs',
              url: '/dashboard/developers/events-&-logs',
            },
          ],
        },
      ],
    },
  ],
}
