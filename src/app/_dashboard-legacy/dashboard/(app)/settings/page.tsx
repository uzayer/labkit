import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const payload = await getPayload({ config: configPromise })
  const labInfo = await payload.findGlobal({ slug: 'lab-info', overrideAccess: true })

  return (
    <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Core lab identity used across schema.org markup and SEO, plus which optional collections
          show up in the dashboard.
        </p>
      </div>
      <SettingsForm labInfo={labInfo} />
    </main>
  )
}
