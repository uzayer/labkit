import { LabKitWordmark } from '@/components/brand/labkit-wordmark'
import { DialWordmark } from '@/components/dial/dial-logo'

/**
 * The login-screen lockup: LabKit × DIAL, with DIAL set as it is in the site
 * header (wordmark, hairline, "North South University HCI").
 *
 * Both marks are inline and drawn in `currentColor`, so they follow Payload's
 * light and dark themes without separate files. The admin has no Tailwind, so
 * everything here is styled inline against Payload's theme variables.
 */
export default function LabKitLogo() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.9rem',
        color: 'var(--color-text)',
      }}
    >
      <LabKitWordmark style={{ height: '1.9rem', width: 'auto', flexShrink: 0 }} />
      <span
        aria-hidden
        style={{ fontSize: '1.1rem', lineHeight: 1, color: 'var(--color-text-tertiary)' }}
      >
        ×
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
        <DialWordmark
          title="DIAL — North South University HCI"
          style={{ height: '1.6rem', width: 'auto', flexShrink: 0 }}
        />
        <span
          aria-hidden
          style={{
            borderLeft: '1px solid var(--color-border)',
            paddingLeft: '0.65rem',
            fontSize: '0.75rem',
            lineHeight: 1.3,
            letterSpacing: '0.12em',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
          }}
        >
          North South
          <br />
          University HCI
        </span>
      </span>
    </span>
  )
}
