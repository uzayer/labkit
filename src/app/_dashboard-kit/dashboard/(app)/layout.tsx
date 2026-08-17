import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { checkRole } from '@/utilities/checkRole'
import { getMeUser } from '@/utilities/getMeUser'

interface Props {
  children: React.ReactNode
}

async function requireAdminUser() {
  const { user } = await getMeUser({ nullUserRedirect: '/dashboard/login' })

  if (!checkRole(['admin'], user)) {
    redirect('/dashboard/login?error=forbidden')
  }

  return user
}

export default async function DashboardLayout({ children }: Props) {
  await requireAdminUser()

  const cookieStore = await cookies()
  const defaultClose = cookieStore.get('sidebar:state')?.value === 'false'
  return (
    <div className="border-grid flex flex-1 flex-col">
      <SidebarProvider defaultOpen={!defaultClose}>
        <AppSidebar />
        <div
          id="content"
          className={cn(
            'flex h-full w-full flex-col',
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
