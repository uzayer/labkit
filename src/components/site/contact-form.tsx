'use client'

import { LoaderIcon } from 'lucide-react'
import { useState } from 'react'
import Turnstile from 'react-turnstile'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:border-foreground md:text-sm'

/** The asterisk is for sighted readers; assistive tech hears `required`. */
const RequiredMark = () => (
  <span aria-hidden className="text-destructive">
    *
  </span>
)

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

/**
 * The contact form. It posts to Payload's `form-submissions` (docs/guides/forms.md)
 * against the Form titled "Contact", with Turnstile's token in the
 * `cf-turnstile-token` header and an empty `website` honeypot. The browser's
 * own validation (`required`, `type="email"`) checks the fields, so the page
 * loads no validation library.
 */
export function ContactForm({ formId, email }: { formId: string; email: string | null }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [turnstileToken, setTurnstileToken] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    // Without a token the API answers 400; name the actual problem instead.
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus({
        kind: 'error',
        message: 'Please complete the verification check above the button, then send again.',
      })
      return
    }
    setStatus({ kind: 'sending' })
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (TURNSTILE_SITE_KEY) headers['cf-turnstile-token'] = turnstileToken
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          form: formId,
          submissionData: ['name', 'email', 'message', 'website'].map((field) => ({
            field,
            value: String(data.get(field) ?? ''),
          })),
        }),
      })
      if (!response.ok) throw new Error(`Contact form request failed: ${response.status}`)
      form.reset()
      setStatus({ kind: 'sent' })
    } catch {
      setStatus({
        kind: 'error',
        message: email
          ? `Something went wrong. Please try again, or email ${email}.`
          : 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      {/* Always in the page, so the thank-you is announced when it appears. */}
      <div role="status">
        {status.kind === 'sent' && (
          <p className="border-brand text-brand border-l-2 py-1 pl-3 text-sm">
            Thank you. We&apos;ll be in touch soon.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Name <RequiredMark />
        </label>
        <input id="contact-name" name="name" required autoComplete="name" className={fieldClass} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email <RequiredMark />
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message <RequiredMark />
        </label>
        <textarea id="contact-message" name="message" required rows={6} className={fieldClass} />
      </div>

      {/* Bot honeypot: people never see or fill it (docs/guides/forms.md). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] size-px overflow-hidden opacity-0"
      >
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {TURNSTILE_SITE_KEY && (
        <Turnstile
          sitekey={TURNSTILE_SITE_KEY}
          refreshExpired="auto"
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
        />
      )}

      {status.kind === 'error' && (
        <p role="alert" className="text-sm text-destructive">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === 'sending'}
        className="ease-snappy inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform duration-150 active:scale-[0.97] disabled:opacity-70 motion-reduce:transition-none"
      >
        {status.kind === 'sending' ? (
          <>
            <LoaderIcon aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
            Sending…
          </>
        ) : (
          'Send message'
        )}
      </button>
    </form>
  )
}
