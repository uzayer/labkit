import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { checkRole } from '@/utilities/checkRole'
import { getMeUser } from '@/utilities/getMeUser'
import { cn } from '@/utils'

interface DashboardAppLayoutProps {
  children: React.ReactNode
}

async function requireAdminUser() {
  const { user } = await getMeUser({ nullUserRedirect: '/dashboard/login' })

  if (!checkRole(['admin'], user)) {
    redirect('/dashboard/login?error=forbidden')
  }

  return user
}

export default async function DashboardAppLayout({ children }: DashboardAppLayoutProps) {
  await requireAdminUser()

  const cookieStore = await cookies()
  const sidebarState =
    cookieStore.get('sidebar:state')?.value ?? cookieStore.get('sidebar_state')?.value
  const defaultOpen = sidebarState !== 'false'

  return (
    <div className="flex flex-1 flex-col">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div
          id="content"
          className={cn(
            'bg-background flex h-full w-full flex-col',
            'has-[div[data-layout=fixed]]:h-svh',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[data-layout=fixed]:group-data-[scroll-locked=1]/body:h-svh',
          )}
        >
          {children}
        </div>
      </SidebarProvider>
    </div>
  )
}
