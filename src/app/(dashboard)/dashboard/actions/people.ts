'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

import { checkRole } from '@/utilities/checkRole'
import { getMeUser } from '@/utilities/getMeUser'

async function requireAdminUser() {
  const { user } = await getMeUser()

  if (!checkRole(['admin'], user)) {
    throw new Error('Unauthorized people operation')
  }

  return user
}

export interface PeopleActionResult {
  success: boolean
  error?: string
}

export async function toggleTeamDisplayInWebsite(
  id: string,
  displayInWebsite: boolean,
): Promise<PeopleActionResult> {
  await requireAdminUser()
  const payload = await getPayload({ config: configPromise })

  try {
    await payload.update({
      collection: 'team',
      id,
      data: { displayInWebsite },
      overrideAccess: true,
    })
    revalidatePath('/dashboard/people')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update team member',
    }
  }
}
