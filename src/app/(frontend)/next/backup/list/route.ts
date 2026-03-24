import { listBackups } from '@/components/AdminDashboard/BackupDashboard/actions'

export async function GET(req: Request): Promise<Response> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response('Service unavailable', {
      status: 503,
    })
  }
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }
  const blobs = await listBackups()
  return new Response(JSON.stringify(blobs), { status: 200 })
}
