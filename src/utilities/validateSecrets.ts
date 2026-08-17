const MIN_SECRET_LENGTH = 32
const WEAK_SECRET_FRAGMENTS = [
  'demo-',
  'test-',
  'changeme',
  'example',
  'replace-me',
  'secret',
  'password',
  '123',
] as const

export function isWeakSecret(secret: string) {
  const normalizedSecret = secret.trim().toLowerCase()

  return (
    normalizedSecret.length < MIN_SECRET_LENGTH ||
    WEAK_SECRET_FRAGMENTS.some((fragment) => normalizedSecret.includes(fragment))
  )
}

export function assertStrongSecret(name: string, secret: string | undefined) {
  if (!secret || isWeakSecret(secret)) {
    throw new Error(
      `${name} must be at least ${MIN_SECRET_LENGTH} characters and not a demo value.`,
    )
  }

  return secret
}

/**
 * Require Payload's signing secret in every environment, and reject weak values
 * for production deployments. Optional feature secrets are only validated when
 * configured because draft preview and cron automation can be disabled.
 */
export function validateRuntimeSecrets(environment = process.env) {
  const payloadSecret = environment.PAYLOAD_SECRET

  if (!payloadSecret) {
    throw new Error('PAYLOAD_SECRET must be set.')
  }

  if (environment.NODE_ENV !== 'production') {
    return payloadSecret
  }

  assertStrongSecret('PAYLOAD_SECRET', payloadSecret)

  if (environment.NEXT_PRIVATE_DRAFT_SECRET) {
    assertStrongSecret('NEXT_PRIVATE_DRAFT_SECRET', environment.NEXT_PRIVATE_DRAFT_SECRET)
  }

  if (environment.CRON_SECRET) {
    assertStrongSecret('CRON_SECRET', environment.CRON_SECRET)
  }

  return payloadSecret
}
