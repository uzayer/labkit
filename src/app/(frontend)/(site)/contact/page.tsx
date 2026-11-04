import type { Metadata } from 'next'

import { ContactForm } from '@/components/site/contact-form'
import { TextLink } from '@/components/site/links'
import { PageHeader } from '@/components/site/page-header'
import { getSite } from '@/lib/site'
import { inlineLink } from '@/lib/site/typography'

export const metadata: Metadata = { title: 'Contact' }

/**
 * Who is writing, and where each of them should go. Naming them before the
 * form sends students to the page where joining is written down, and tells
 * the others what to put in the message.
 */
const WHO_IS_WRITING = [
  {
    title: 'Students',
    body: 'Asking about joining the lab or a research position? The Join Us page says how.',
    link: { text: 'How to join', href: '/join-us' },
  },
  {
    title: 'Researchers and collaborators',
    body: 'Proposing joint work or a visit? Say what you are working on and where it meets ours.',
    link: { text: 'See our publications', href: '/publications' },
  },
  {
    title: 'Press and media',
    body: 'Mention your outlet and your deadline in the first line.',
    link: { text: 'About the lab', href: '/about' },
  },
]

export default async function ContactPage() {
  const site = await getSite()
  const { labInfo, contactFormId } = site
  const address = [
    labInfo.parentOrganization?.department,
    labInfo.parentOrganization?.name,
    labInfo.location?.address,
    labInfo.location?.city,
    labInfo.location?.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <PageHeader eyebrow="Lab" title="Get in touch" />
      <section className="container grid gap-12 pb-16 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-24">
        <div className="flex flex-col gap-10 border-t border-border pt-6">
          <ul>
            {WHO_IS_WRITING.map((who) => (
              <li key={who.title} className="border-b border-border py-5 first:pt-0">
                <h2 className="font-display text-xl leading-snug">{who.title}</h2>
                <p className="mt-1.5 max-w-prose text-sm text-pretty text-muted-foreground">
                  {who.body}
                </p>
                <TextLink href={who.link.href} className="mt-3">
                  {who.link.text}
                </TextLink>
              </li>
            ))}
          </ul>
          {(labInfo.email || address) && (
            <dl className="text-sm">
              {labInfo.email && (
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${labInfo.email}`} className={inlineLink}>
                      {labInfo.email}
                    </a>
                  </dd>
                </div>
              )}
              {address && (
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-y border-border py-3">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd className="text-pretty">{address}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="relative border-t border-border pt-6">
          <h2 className="sr-only">Send a message</h2>
          {contactFormId ? (
            <ContactForm formId={contactFormId} email={labInfo.email ?? null} />
          ) : (
            // Without the Form the submission has nowhere to be stored.
            <p className="text-pretty text-muted-foreground">
              {labInfo.email ? (
                <>
                  Email us at{' '}
                  <a href={`mailto:${labInfo.email}`} className={inlineLink}>
                    {labInfo.email}
                  </a>
                  .
                </>
              ) : (
                'Contact details will appear here once the Lab adds them.'
              )}
            </p>
          )}
        </div>
      </section>
    </>
  )
}
