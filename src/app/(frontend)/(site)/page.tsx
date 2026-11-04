import type { Metadata } from 'next'
import { getPayload } from 'payload'

import config from '@payload-config'

// A placeholder until the default Lab site lands (roadmap step 5). Rendered per
// request, so a Lab Editor's LabInfo edits show at once and the build needs no data.
export const dynamic = 'force-dynamic'

const getLabInfo = async () => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'lab-info', depth: 0 })
}

export async function generateMetadata(): Promise<Metadata> {
  const labInfo = await getLabInfo()
  return { title: labInfo.name || 'LabKit', description: labInfo.description || undefined }
}

export default async function HomePage() {
  const labInfo = await getLabInfo()

  return (
    <main style={{ maxWidth: '36rem', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.25rem', margin: 0 }}>{labInfo.name || 'Your Lab'}</h1>
      {labInfo.description ? (
        <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#555' }}>
          {labInfo.description}
        </p>
      ) : null}
      <p style={{ marginTop: '2rem', color: '#888' }}>Site coming soon.</p>
    </main>
  )
}
