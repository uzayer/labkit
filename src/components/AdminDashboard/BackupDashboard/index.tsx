import './index.scss'
import { del } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { createBackup, listBackups, restoreBackup } from './actions'

import { Button, Popup, Collapsible } from '@payloadcms/ui'
import { isAdminHidden } from '@/access/isAdmin'
import { I18n } from '@payloadcms/translations'
import { getCurrentDbName, getCurrentHostname, transformBlobName } from './utils'
import { FilterControls } from './index.client'
import { User } from '@/payload-types'

interface BackupDashboardProps {
  user: User | null
  i18n: I18n
  searchParams: Record<string, string>
}

const BackupDashboard: React.FC<BackupDashboardProps> = async ({ user, i18n, searchParams }) => {
  if (!user) return

  if (isAdminHidden({ user })) {
    return
  }

  if (!process.env.MONGODB_URI || !process.env.BLOB_READ_WRITE_TOKEN) {
    return
  }
  const blobs = await listBackups()
  const sortedBlobs = [...blobs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )
  const showOtherDb = searchParams.showOtherDb === 'true'
  const showOtherHostname = searchParams.showOtherHostname === 'true'
  const includeMedia = searchParams.includeMedia === 'true'

  const currentHostname = getCurrentHostname()
  const currentDbName = getCurrentDbName()

  const countOtherDb = sortedBlobs.filter((blob) => {
    const { dbName } = transformBlobName(blob.pathname)
    return currentDbName !== dbName
  }).length

  const countOtherHostname = sortedBlobs.filter((blob) => {
    const { hostname } = transformBlobName(blob.pathname)
    return currentHostname !== hostname
  }).length

  return (
    <div className="backup-dashboard">
      <h2>
        Backups <span className="experimental">(experimental)</span>
      </h2>

      <Collapsible initCollapsed={true}>
        <FilterControls
          countOtherDb={countOtherDb}
          countOtherHostname={countOtherHostname}
          showOtherDb={showOtherDb}
          showOtherHostname={showOtherHostname}
          includeMedia={includeMedia}
        />

        {sortedBlobs.map((blob) => {
          const { type, dbName, hostname, fileType } = transformBlobName(blob.pathname)

          const isCurrentDb = currentDbName === dbName
          const isCurrentHostname = currentHostname === hostname

          if (!(showOtherDb || isCurrentDb)) return
          if (!(showOtherHostname || isCurrentHostname)) return

          return (
            <div key={blob.pathname} className="backup-item">
              <p>
                <span>
                  {new Date(blob.uploadedAt).toLocaleString(i18n?.language || 'en')}:{' '}
                  {type === 'cron' ? 'Cron Backup' : 'Manual Backup'},{' '}
                </span>
                <span className={isCurrentDb ? '' : 'red-text'}>DB: {dbName || 'Unknown'}, </span>
                <span className={isCurrentHostname ? '' : 'red-text'}>
                  Host: {hostname || 'Unknown'},{' '}
                </span>
                <span>{fileType === 'json' ? 'Collections only' : 'Collections & Media'}, </span>
                <span>{blob.size} bytes</span>
              </p>
              <div className="right">
                <a
                  className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup"
                  href={blob.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Backup
                </a>
                <Popup
                  className="btn-right"
                  button={
                    <div className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup">
                      Restore Backup
                    </div>
                  }
                >
                  <div>
                    Restoring this Backup will may override some of your newly created data. Are you
                    sure you want to continue?
                  </div>
                  <Button
                    className="btn-red"
                    onClick={async () => {
                      'use server'
                      await restoreBackup(blob.downloadUrl)
                      revalidatePath('/admin')
                    }}
                  >
                    Yes
                  </Button>
                </Popup>
                <Popup
                  button={
                    <div className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup">
                      Delete Backup
                    </div>
                  }
                >
                  <div>Are you sure you want to delete this backup?</div>
                  <Button
                    className="btn-red"
                    onClick={async () => {
                      'use server'
                      await del(blob.url)
                      revalidatePath('/admin')
                    }}
                  >
                    Yes
                  </Button>
                </Popup>
              </div>
            </div>
          )
        })}
        <div className="make-backup-container">
          <Button
            onClick={async () => {
              'use server'
              await createBackup(false, includeMedia)
              revalidatePath('/admin')
            }}
          >
            Create manual Backup
          </Button>
          <span className="text">Manual backups will not get automatically deleted</span>
        </div>
      </Collapsible>
    </div>
  )
}

export default BackupDashboard
