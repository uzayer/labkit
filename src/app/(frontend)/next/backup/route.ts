import { createBackup } from '@/components/AdminDashboard/BackupDashboard/actions'
import { after } from 'next/server'

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
  after(createBackup(true))
  return new Response('Backup creation started', { status: 202 })
}
