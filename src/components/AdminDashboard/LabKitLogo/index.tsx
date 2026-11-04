import { LabKitWordmark } from '@/components/brand/labkit-wordmark'

/**
 * The login-screen logo. The wordmark is inline and drawn in `currentColor`, so it
 * follows Payload's light and dark themes without separate files.
 */
export default function LabKitLogo() {
  return (
    <span style={{ display: 'inline-flex', color: 'var(--color-text)' }}>
      <LabKitWordmark style={{ height: '1.9rem', width: 'auto', flexShrink: 0 }} />
    </span>
  )
}
