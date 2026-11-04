import type { CollectionSlug } from 'payload'
import { createPayloadRequest, getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

import configPromise from '@payload-config'

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const configuredDraftSecret = process.env.NEXT_PRIVATE_DRAFT_SECRET

  // The Payload session cookie authenticates this browser request. Keep the
  // server-only secret as an explicit feature gate, but never put it in a URL.
  if (!configuredDraftSecret) {
    payload.logger.warn('Blocked draft-mode preview request without a configured secret')
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path || !collection || !slug) {
    payload.logger.warn('Blocked draft-mode preview request with insufficient parameters')
    return new Response('Insufficient search params', { status: 404 })
  }

  if (!path.startsWith('/')) {
    payload.logger.warn('Blocked draft-mode preview request with a non-relative path')
    return new Response('This endpoint can only be used for relative previews', { status: 500 })
  }

  let user

  try {
    const requestHeaders = new Headers(req.headers)
    const localReq = await createPayloadRequest({ payload, req: { headers: requestHeaders } })
    const authResult = await payload.auth({
      req: localReq,
      headers: requestHeaders,
    })
    user = authResult.user
  } catch (error) {
    payload.logger.warn({
      err: error,
      msg: 'Blocked draft-mode preview request after auth failure',
    })
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    payload.logger.warn('Blocked unauthenticated draft-mode preview request')
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  draft.enable()
  payload.logger.info(`Authorized draft-mode preview request for user ${user.id}`)

  redirect(path)
}
