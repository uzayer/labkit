import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Contact1 } from '@/components/dial/contact1'
import { getDial } from '@/lib/dial/data/get'

/**
 * The Payload Form the contact page submits to, created once by the Operator
 * in Admin → Forms with this title and `name`, `email`, `message` fields.
 */
const CONTACT_FORM_TITLE = 'Contact'

async function contactFormId(): Promise<string | null> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'forms',
    where: { title: { equals: CONTACT_FORM_TITLE } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    select: {},
  })
  return docs[0]?.id ?? null
}

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with the DIAL lab for collaboration, media, and general enquiries.',
}

export default async function ContactPage() {
  const { labInfo, director } = await getDial()
  const pi = director()
  const formId = await contactFormId()
  return (
    <Contact1
      formId={formId}
      email={labInfo.email ?? ''}
      address={labInfo.address ?? labInfo.institution}
      scholarUrl={pi?.socials?.find((s) => s.platform === 'google-scholar')?.url}
    />
  )
}
