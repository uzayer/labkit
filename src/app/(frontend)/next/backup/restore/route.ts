import { restoreBackup } from '@/components/AdminDashboard/BackupDashboard/actions'

export async function POST(req: Request): Promise<Response> {
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
  const { url } = await req.json()
  new URL(url)
  await restoreBackup(url)
  return Response.json({ message: 'Backup restore finished' }, { status: 202 })
}
