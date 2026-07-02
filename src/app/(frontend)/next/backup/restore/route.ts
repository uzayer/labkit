import { restoreBackup } from '@/components/AdminDashboard/BackupDashboard/actions'
import {
  assertStrongCronSecret,
  isBackupPathname,
} from '@/components/AdminDashboard/BackupDashboard/security'

export async function POST(req: Request): Promise<Response> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response('Service unavailable', {
      status: 503,
    })
  }

  let cronSecret: string

  try {
    cronSecret = assertStrongCronSecret()
  } catch (error) {
    return new Response('Service unavailable', {
      status: 503,
    })
  }

  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const { pathname } = await req.json()

  if (typeof pathname !== 'string' || !isBackupPathname(pathname)) {
    return new Response('Invalid backup pathname', {
      status: 400,
    })
  }

  await restoreBackup(pathname, [], false, true)
  return Response.json({ message: 'Backup restore finished' }, { status: 202 })
}
