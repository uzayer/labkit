import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/ui/rsc'
import { redirect } from 'next/navigation'
import React from 'react'

import { readFeatures } from '../globals/Features/features'
import { checkRole } from '../utilities/checkRole'
import { OnboardingWizard, type WizardInitialState } from './OnboardingWizard'
import { findOnboardingRun, getOnboardingStatus, runSummary } from './status'

/**
 * The first-run wizard at `/admin/onboarding`. A custom root view gets no
 * template of its own, so it wraps itself in Payload's DefaultTemplate to keep
 * the nav and header.
 */
export async function OnboardingView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, locale, visibleEntities } = initPageResult
  const { payload, user } = req
  const adminRoute = payload.config.routes.admin

  if (!user)
    redirect(`${adminRoute}/login?redirect=${encodeURIComponent(`${adminRoute}/onboarding`)}`)

  // A Lab that's already set up (finished the wizard, or onboarded before it
  // existed, like DIAL) never gets the wizard, even by typing its URL.
  if (!(await getOnboardingStatus(payload)).needed) redirect(adminRoute)

  const isAdmin = checkRole(['admin'], user as never)
  let initial: WizardInitialState | null = null

  if (isAdmin) {
    const [labInfo, features, run, pis] = await Promise.all([
      payload.findGlobal({ slug: 'lab-info', depth: 1, overrideAccess: true }),
      readFeatures(payload, req),
      findOnboardingRun(payload),
      // The PI is the Director the wizard last created or linked; it carries their
      // ORCID. Newest first, so changing the PI in step 1 picks the new one.
      payload.find({
        collection: 'team',
        where: { and: [{ role: { equals: 'director' } }, { orcid: { exists: true } }] },
        sort: '-updatedAt',
        limit: 1,
        depth: 0,
        overrideAccess: true,
      }),
    ])
    const pi = pis.docs[0]
    const logo = labInfo.logo && typeof labInfo.logo === 'object' ? labInfo.logo : null
    const openReviewItems = run
      ? (
          await payload.count({
            collection: 'review-items',
            where: { and: [{ run: { equals: run.id } }, { status: { equals: 'open' } }] },
            overrideAccess: true,
          })
        ).totalDocs
      : 0

    initial = {
      adminRoute,
      apiRoute: payload.config.routes.api,
      pi: pi?.orcid ? { id: pi.id, name: pi.name ?? '', orcid: pi.orcid } : null,
      labInfo: {
        name: labInfo.name ?? '',
        shortName: labInfo.shortName ?? '',
        headline: labInfo.headline ?? '',
        description: labInfo.description ?? '',
        email: labInfo.email ?? '',
        institution: labInfo.parentOrganization?.name ?? '',
        department: labInfo.parentOrganization?.department ?? '',
        city: labInfo.location?.city ?? '',
        country: labInfo.location?.country ?? '',
        logo: logo ? { id: logo.id, url: logo.url ?? null, filename: logo.filename ?? null } : null,
      },
      features,
      run: run ? { ...runSummary(run), openReviewItems } : null,
      step: Number(searchParams?.step) || null,
    }
  }

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <OnboardingWizard initial={initial} />
    </DefaultTemplate>
  )
}
