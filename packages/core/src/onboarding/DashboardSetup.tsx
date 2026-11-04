import type { Payload } from 'payload'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

import { checkRole } from '../utilities/checkRole'
import { SETUP_LATER_COOKIE } from './cookie'
import { ONBOARDING_PATH, getOnboardingStatus, getSetupChecklist } from './status'
import './index.scss'

interface Props {
  payload: Payload
  user?: unknown
}

/**
 * Sits above the admin dashboard (`beforeDashboard`). While the Lab isn't set
 * up it links to the wizard, and sends an admin straight there the first time,
 * when nothing exists yet. After the wizard it lists what's left to do, and
 * renders nothing once that list is empty. A Lab set up before the wizard
 * existed (DIAL) sees neither.
 */
export async function DashboardSetup({ payload, user }: Props) {
  const adminRoute = payload.config.routes.admin
  const status = await getOnboardingStatus(payload)
  const isAdmin = checkRole(['admin'], user as never)
  const wizardHref = `${adminRoute}${ONBOARDING_PATH}`

  if (status.needed) {
    if (!isAdmin) return null
    // The wizard's "Set up later" sets this cookie, so the redirect can't trap
    // anyone. A cookie rather than a field: dismissing is per browser, not a Lab
    // setting, and needs no migration.
    const later = (await cookies()).get(SETUP_LATER_COOKIE)?.value === '1'
    if (status.pristine && !later) redirect(wizardHref)
    return (
      <div className="labkit-setup">
        <h2>Finish setting up your Lab</h2>
        <p>
          Add the PI, the Lab&apos;s details and its first Publications. It takes a few minutes.
        </p>
        <a className="labkit-setup__cta" href={wizardHref}>
          Continue setup
        </a>
      </div>
    )
  }

  if (!status.completed) return null
  const items = await getSetupChecklist(payload, adminRoute)
  if (items.length === 0) return null

  return (
    <div className="labkit-setup">
      <h2>Still to do</h2>
      <ul className="labkit-setup__list">
        {items.map((item) => (
          <li key={item.key}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
