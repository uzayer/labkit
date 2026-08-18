/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

type ParamsPromise = {
  params: Promise<{
    slug: string[]
  }>
}
const TURNSTILE_PROTECTED_SLUGS = ['form-submissions']
const FORM_SUBMISSION_LIMIT = 5
const FORM_SUBMISSION_WINDOW_MS = 60_000
const formSubmissionAttempts = new Map<string, number[]>()

const formProtectionError = (message: string, status: number) =>
  new Response(JSON.stringify({ errors: [{ message }], status }), { status })

const getClientIP = (req: Request) =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip')

const isFormSubmissionRateLimited = (clientIP: string, now = Date.now()) => {
  const windowStart = now - FORM_SUBMISSION_WINDOW_MS
  for (const [ip, attempts] of formSubmissionAttempts) {
    if (!attempts.some((attempt) => attempt > windowStart)) {
      formSubmissionAttempts.delete(ip)
    }
  }
  const recentAttempts = (formSubmissionAttempts.get(clientIP) || []).filter(
    (attempt) => attempt > windowStart,
  )

  if (recentAttempts.length >= FORM_SUBMISSION_LIMIT) {
    formSubmissionAttempts.set(clientIP, recentAttempts)
    return true
  }

  recentAttempts.push(now)
  formSubmissionAttempts.set(clientIP, recentAttempts)
  return false
}

const hasFilledHoneypot = async (req: Request) => {
  if (!req.headers.get('content-type')?.includes('application/json')) return false

  try {
    const body = await req.clone().json()
    return body.submissionData?.some(
      (field: { field?: unknown; value?: unknown }) =>
        field.field === 'website' && typeof field.value === 'string' && field.value.trim() !== '',
    )
  } catch {
    return false
  }
}

const turnstileProtectedRoute =
  (routeHandler: (req: Request, params: ParamsPromise) => Promise<Response>) =>
  async (req: Request, params: ParamsPromise) => {
    const { slug } = await params.params
    if (TURNSTILE_PROTECTED_SLUGS.includes(slug[0])) {
      const clientIP = getClientIP(req)
      if (clientIP && isFormSubmissionRateLimited(clientIP)) {
        return formProtectionError('Too many form submissions. Please try again in a minute.', 429)
      }

      if (await hasFilledHoneypot(req)) {
        return formProtectionError('Your submission could not be accepted.', 400)
      }

      const turnstileConfigured = Boolean(
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY,
      )

      if (process.env.NODE_ENV === 'production' && !turnstileConfigured) {
        return formProtectionError('Form submissions are temporarily unavailable.', 503)
      }

      if (turnstileConfigured) {
        const turnstileToken = req.headers.get('cf-turnstile-token')
        if (!turnstileToken) {
          console.error('No turnstile token provided')
          return formProtectionError(
            'Bot protection could not verify that you are a real human. Turnstile token is required.',
            400,
          )
        }
        const turnstileResponse = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              secret: process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY,
              response: turnstileToken,
            }),
          },
        )
        const data = await turnstileResponse.json()
        if (!data.success) {
          console.error('Turnstile token is invalid', data)
          return formProtectionError(
            'Bot protection could not verify that you are a real human. Turnstile token is invalid',
            400,
          )
        }
      }
    }
    return routeHandler(req, params)
  }

export const GET = REST_GET(config)
export const OPTIONS = REST_OPTIONS(config)
export const POST = turnstileProtectedRoute(REST_POST(config))
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
