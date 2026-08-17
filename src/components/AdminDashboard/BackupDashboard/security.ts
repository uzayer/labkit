import { issueSignedToken, presignUrl } from '@vercel/blob'
import { isWeakSecret } from '@/utilities/validateSecrets'

const BACKUP_PATHNAME_PREFIX = 'backups/'
const BACKUP_FILE_EXTENSIONS = ['.json', '.tar.gz'] as const
const DOWNLOAD_URL_TTL_SECONDS = 60 * 10

export function isBackupPathname(value: string) {
  return (
    value.startsWith(BACKUP_PATHNAME_PREFIX) &&
    BACKUP_FILE_EXTENSIONS.some((extension) => value.endsWith(extension)) &&
    !value.includes('..') &&
    !value.startsWith('/')
  )
}

export function assertStrongCronSecret() {
  const secret = process.env.CRON_SECRET

  if (!secret || isWeakSecret(secret)) {
    throw new Error(
      'CRON_SECRET must be set to a strong, non-demo value before backup automation can be used.',
    )
  }

  return secret
}

export async function createSignedBackupDownloadUrl(pathname: string) {
  if (!isBackupPathname(pathname)) {
    throw new Error('Invalid backup pathname')
  }

  const signedToken = await issueSignedToken({
    operations: ['get', 'head'],
    pathname,
    validUntil: Date.now() + DOWNLOAD_URL_TTL_SECONDS * 1000,
  })

  const { presignedUrl } = await presignUrl(signedToken, {
    access: 'private',
    operation: 'get',
    pathname,
    validUntil: Date.now() + DOWNLOAD_URL_TTL_SECONDS * 1000,
  })

  return presignedUrl
}
