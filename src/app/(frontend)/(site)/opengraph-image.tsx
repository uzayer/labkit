import { ImageResponse } from 'next/og'

import { getSite } from '@/lib/site'

export const alt = 'The Lab’s name and headline'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

/**
 * The link preview every page shares unless it sets its own: the Lab's name
 * and headline on the site's paper colour. Set in the default sans, so it needs
 * no font files.
 */
export default async function OpengraphImage() {
  const { labInfo, labName } = await getSite()
  const institution = labInfo.parentOrganization?.name
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: '#faf8f3',
        color: '#231f1a',
      }}
    >
      <div style={{ display: 'flex', fontSize: 28, letterSpacing: 4, color: '#7a736a' }}>
        {(institution || '').toUpperCase()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>{labName}</div>
        {labInfo.headline && (
          <div style={{ fontSize: 36, lineHeight: 1.3, color: '#5c564e' }}>{labInfo.headline}</div>
        )}
      </div>
    </div>,
    size,
  )
}
