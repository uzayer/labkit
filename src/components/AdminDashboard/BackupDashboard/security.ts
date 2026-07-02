import { issueSignedToken, presignUrl } from '@vercel/blob'

const BACKUP_PATHNAME_PREFIX = 'backups/'
const BACKUP_FILE_EXTENSIONS = ['.json', '.tar.gz'] as const
const DEMO_SECRET_VALUES = ['demo-cron-secret', 'changeme', 'example', 'replace-me'] as const
const MIN_CRON_SECRET_LENGTH = 24
const DOWNLOAD_URL_TTL_SECONDS = 60 * 10

export function isBackupPathname(value: string) {
  return (
    value.startsWith(BACKUP_PATHNAME_PREFIX) &&
    BACKUP_FILE_EXTENSIONS.some((extension) => value.endsWith(extension)) &&
    !value.includes('..') &&
    !value.startsWith('/')
  )
}

function isWeakCronSecret(secret: string) {
  const normalizedSecret = secret.trim().toLowerCase()

  return (
    normalizedSecret.length < MIN_CRON_SECRET_LENGTH ||
    DEMO_SECRET_VALUES.some((candidate) => normalizedSecret.includes(candidate))
  )
}

export function assertStrongCronSecret() {
  const secret = process.env.CRON_SECRET

  if (!secret || isWeakCronSecret(secret)) {
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
