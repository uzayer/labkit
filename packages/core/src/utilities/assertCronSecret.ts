import { isWeakSecret } from './validateSecrets'

export function assertStrongCronSecret() {
  const secret = process.env.CRON_SECRET
  if (!secret || isWeakSecret(secret)) {
    throw new Error('CRON_SECRET must be set to a strong, non-demo value for the jobs cron.')
  }
  return secret
}
