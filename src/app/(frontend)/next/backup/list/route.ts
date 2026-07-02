import { listBackups } from '@/components/AdminDashboard/BackupDashboard/actions'
import { assertStrongCronSecret } from '@/components/AdminDashboard/BackupDashboard/security'

export async function GET(req: Request): Promise<Response> {
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
  const blobs = await listBackups(true)
  return new Response(JSON.stringify(blobs), { status: 200 })
}
