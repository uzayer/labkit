import { serverUrl } from '@/config/server'
import { draftMode } from 'next/headers'
import { NextRequest } from 'next/server'

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')

  if (!origin) return false

  try {
    const requestOrigin = new URL(origin)
    const currentOrigin = new URL(request.nextUrl.origin)
    const configuredOrigin = new URL(serverUrl)

    const matchesCurrentOrigin =
      requestOrigin.protocol === currentOrigin.protocol &&
      requestOrigin.port === currentOrigin.port &&
      (requestOrigin.hostname === currentOrigin.hostname ||
        (requestOrigin.hostname === 'localhost' && currentOrigin.hostname === '127.0.0.1') ||
        (requestOrigin.hostname === '127.0.0.1' && currentOrigin.hostname === 'localhost'))

    const matchesConfiguredOrigin = requestOrigin.origin === configuredOrigin.origin

    return matchesCurrentOrigin || matchesConfiguredOrigin
  } catch {
    return false
  }
}

async function disableDraftMode(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!isAllowedOrigin(request)) {
    return new Response('Forbidden', { status: 403 })
  }

  return disableDraftMode()
}

export async function GET(): Promise<Response> {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      Allow: 'POST',
    },
  })
}
