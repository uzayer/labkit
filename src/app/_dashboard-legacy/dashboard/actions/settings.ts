'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

import { checkRole } from '@labkit/core/access'
import { getMeUser } from '@/utilities/getMeUser'

async function requireAdminUser() {
  const { user } = await getMeUser()

  if (!checkRole(['admin'], user)) {
    throw new Error('Unauthorized settings operation')
  }

  return user
}

export interface SettingsActionResult {
  success: boolean
  error?: string
}

export interface LabInfoFormValues {
  name: string
  shortName?: string
  description?: string
  parentOrganizationName?: string
  email?: string
  url?: string
  features: {
    projects: boolean
    grants: boolean
    awards: boolean
    researchThemes: boolean
  }
}

function emptyToUndefined(value?: string): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export async function updateLabInfo(values: LabInfoFormValues): Promise<SettingsActionResult> {
  await requireAdminUser()
  const payload = await getPayload({ config: configPromise })

  try {
    // parentOrganization is a group with `url`/`department` fields this form
    // doesn't expose — fetch the current global first so updateGlobal's
    // full-replace-on-write behavior for group fields doesn't clobber them.
    const existing = await payload.findGlobal({ slug: 'lab-info', overrideAccess: true })

    await payload.updateGlobal({
      slug: 'lab-info',
      data: {
        name: values.name,
        shortName: emptyToUndefined(values.shortName),
        description: emptyToUndefined(values.description),
        parentOrganization: {
          ...existing.parentOrganization,
          name: emptyToUndefined(values.parentOrganizationName),
        },
        email: emptyToUndefined(values.email),
        url: emptyToUndefined(values.url),
      },
      overrideAccess: true,
    })
    await payload.updateGlobal({
      slug: 'features',
      data: values.features,
      overrideAccess: true,
    })
    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update lab settings',
    }
  }
}
