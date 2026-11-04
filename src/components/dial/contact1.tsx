'use client'

import { LoaderIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import Turnstile from 'react-turnstile'

import type { ContactFormData } from '@/components/dial/contact-schema'

import { Button } from '@/components/dial/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/dial/ui/field'
import { Input } from '@/components/dial/ui/input'
import { Textarea } from '@/components/dial/ui/textarea'
import { TextLink } from '@/components/dial/editorial'
import { CropMarks } from '@/components/dial/marks'
import { enterStep } from '@/lib/dial/motion'
import { label, lede, pageTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

const linkClass =
  'underline decoration-border underline-offset-[6px] transition-colors hover:decoration-current'

/**
 * Who is writing, and where each of them should go.
 *
 * One form for everybody means the lab triages by hand: a student asking to
 * join, a researcher proposing a collaboration and a journalist on a deadline
 * all arrive in the same inbox in the same shape, and two of the three are in
 * the wrong place. Naming the three before the form sends the students to
 * `/join-us` (where the actual process is written down) and tells the other
 * two what to put in the message, which is the whole of what a triage step
 * can usefully do without becoming a form builder.
 */
const WHO_IS_WRITING = [
  {
    title: 'Students',
    body: 'Wanting to join the lab, or asking about research assistantships. The form is not the route — there is a proper one, and it is short.',
    link: { text: 'How to join', href: '/join-us' },
  },
  {
    title: 'Researchers & collaborators',
    body: "Proposing joint work, a visit, or a co-authored paper. Say what you are working on and which of DIAL's areas it touches; that is enough to start.",
    link: { text: 'See the research areas', href: '/research' },
  },
  {
    title: 'Press & media',
    body: "Reporting on the lab's work. Mention your outlet and your deadline in the first line, and the papers behind the work are all here in full.",
    link: { text: 'Browse publications', href: '/publications' },
  },
]

/**
 * zod and its resolver load on demand: the form validates on submit only, so
 * nothing needs them before then. `loadSchema` runs when the form first takes
 * focus, which leaves seconds of typing for the chunk to arrive; a submit that
 * beats it just waits for the same import.
 */
const loadSchema = () => import('@/components/dial/contact-schema')

// The focus preload is best effort; a failed load is retried and reported on submit.
const preloadSchema = () => {
  loadSchema().catch(() => {})
}

const lazyResolver: Resolver<ContactFormData> = async (values, context, options) => {
  try {
    const { contactFormResolver } = await loadSchema()
    return contactFormResolver(values, context, options)
  } catch {
    // A chunk that will not load (a stale tab after a deploy, a dropped
    // connection) would otherwise make submit do nothing at all.
    return {
      values: {},
      errors: {
        root: {
          type: 'load',
          message: 'The form could not load. Please reload the page and try again.',
        },
      },
    }
  }
}

interface Contact1Props {
  /** Lab contact details, from LabInfo. */
  email: string
  address: string
  scholarUrl?: string | null
  /**
   * The Payload Form (Admin → Forms) submissions are stored against. Without
   * one the form cannot be sent, and says to email the lab instead.
   */
  formId?: string | null
  className?: string
  onSubmit?: (data: ContactFormData) => Promise<void>
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** The asterisk is for sighted readers; assistive tech hears aria-required. */
const RequiredMark = () => (
  <span aria-hidden className="text-destructive">
    *
  </span>
)

/**
 * Required, invalid, and pointed at its error message when it has one, so a
 * screen reader reads the error with the field rather than only once.
 */
const fieldA11y = (name: string, invalid: boolean) => ({
  'aria-required': true,
  'aria-invalid': invalid,
  'aria-describedby': invalid ? `${name}-error` : undefined,
})

const Contact1 = ({ email, address, scholarUrl, formId, className, onSubmit }: Contact1Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  // Bot honeypot: people never see or fill it (docs/guides/forms.md).
  const [website, setWebsite] = useState('')

  const form = useForm<ContactFormData>({
    resolver: lazyResolver,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { name: '', email: '', message: '' },
  })

  const handleFormSubmit = async (data: ContactFormData) => {
    // Without a token the API answers 400, which would surface as "something
    // went wrong"; name the actual problem instead.
    if (!onSubmit && TURNSTILE_SITE_KEY && !turnstileToken) {
      form.setError('root', {
        message: 'Please complete the verification check above the button, then send again.',
      })
      return
    }
    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        if (!formId) throw new Error('No contact form is configured')
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        if (TURNSTILE_SITE_KEY) headers['cf-turnstile-token'] = turnstileToken
        const response = await fetch('/api/form-submissions', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            form: formId,
            submissionData: [
              { field: 'name', value: data.name },
              { field: 'email', value: data.email },
              { field: 'message', value: data.message },
              { field: 'website', value: website },
            ],
          }),
        })
        if (!response.ok) {
          throw new Error('Contact form request failed')
        }
      }
      setIsSubmitted(true)
      setShowSuccess(true)
      form.reset()
      setTimeout(() => setShowSuccess(false), 4500)
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch {
      form.setError('root', {
        message: email
          ? `Something went wrong. Please try again, or email ${email}.`
          : 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    // Contact was the last surface still outside the system: no crop marks, no
    // composition, no drawn marks. It is a printed sheet like every other page.
    <section className={cn('relative isolate container pt-16 pb-24 md:pt-24', className)}>
      {/* No bleeding composition here, deliberately: every other page has an
          open right margin for one, and this page has a form in it. The stamp
          does the work instead — which is the right mark for a contact page. */}
      <CropMarks className="ink-mark-soft top-8 md:top-10" />
      <p className={cn(label, 'enter')} style={enterStep(0)}>
        Contact
      </p>
      <div className="enter relative mt-4 w-fit" style={enterStep(1)}>
        <h1 className={pageTitle}>Get in touch</h1>
      </div>

      <div className="relative mt-10 grid gap-12 pt-6 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-24">
        <span
          aria-hidden
          className="enter-rule absolute inset-x-0 top-0 h-px bg-border"
          style={enterStep(2)}
        />
        <div className="enter flex flex-col gap-10" style={enterStep(3)}>
          <p className={lede}>For collaboration, media, and general enquiries.</p>

          <ul>
            {WHO_IS_WRITING.map((who) => (
              <li key={who.title} className="border-t border-border py-5 last:border-b">
                <h2 className="font-display text-xl leading-snug">{who.title}</h2>
                <p className="mt-1.5 max-w-prose text-sm text-pretty text-muted-foreground">
                  {who.body}
                </p>
                <TextLink href={who.link.href} className="mt-3 text-sm">
                  {who.link.text}
                </TextLink>
              </li>
            ))}
          </ul>

          <dl className="text-sm">
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="text-pretty">{address}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-y border-border py-3">
              <dt className="text-muted-foreground">Elsewhere</dt>
              <dd className="flex flex-wrap gap-x-4 gap-y-1">
                {scholarUrl && (
                  <a
                    href={scholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    Google Scholar
                  </a>
                )}
                <a
                  href="https://www.researchgate.net/profile/Nova_Ahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  ResearchGate
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          onFocus={preloadSchema}
          className="enter z-10 w-full"
          style={enterStep(4)}
        >
          <div className="w-full">
            {/* The live region is always in the page, so the thank-you is
                announced when it appears (a region inserted together with its
                text often is not). */}
            <div role="status">
              {isSubmitted && (
                <p
                  className={cn(
                    'border-brand text-brand ease-snappy mb-6 border-l-2 py-1 pl-3 text-sm transition-[opacity,translate] duration-300 starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0',
                    showSuccess ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  Thank you. We&apos;ll be in touch soon.
                </p>
              )}
            </div>

            <FieldGroup className="gap-6">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Name <RequiredMark />
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      autoComplete="name"
                      {...fieldA11y(field.name, fieldState.invalid)}
                      placeholder="Your name"
                    />
                    {fieldState.invalid && (
                      <FieldError id={`${field.name}-error`} errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email <RequiredMark />
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      {...fieldA11y(field.name, fieldState.invalid)}
                      placeholder="you@example.com"
                    />
                    {fieldState.invalid && (
                      <FieldError id={`${field.name}-error`} errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Message <RequiredMark />
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      {...fieldA11y(field.name, fieldState.invalid)}
                      placeholder="How can we help you?"
                      rows={5}
                    />
                    {fieldState.invalid && (
                      <FieldError id={`${field.name}-error`} errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute -left-[9999px] size-px overflow-hidden opacity-0"
              >
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>

              {TURNSTILE_SITE_KEY && (
                <Turnstile
                  sitekey={TURNSTILE_SITE_KEY}
                  refreshExpired="auto"
                  onVerify={setTurnstileToken}
                  onExpire={() => setTurnstileToken('')}
                />
              )}

              {form.formState.errors.root && (
                <p role="alert" className="text-sm text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="ease-snappy w-fit rounded-full px-5 transition-transform duration-150 active:scale-[0.97]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <LoaderIcon
                      aria-hidden
                      className="mr-2 size-4 animate-spin motion-reduce:animate-none"
                    />
                    Sending…
                  </>
                ) : (
                  'Send message'
                )}
              </Button>
            </FieldGroup>
          </div>
        </form>
      </div>
    </section>
  )
}

export { Contact1 }
