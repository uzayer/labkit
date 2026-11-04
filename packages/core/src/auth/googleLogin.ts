import type { PayloadRequest, Plugin } from 'payload'
import { OAuth2Plugin } from 'payload-oauth2'

import { serverUrl } from '../utilities/serverUrl'

/** Google login is on only when both credentials are set. */
export const googleLoginActive = !!(
  process.env.GOOGLE_LOGIN_CLIENT_ID && process.env.GOOGLE_LOGIN_CLIENT_SECRET
)

/**
 * "Sign in with Google" for the admin. Users still need an account: the Google email
 * must match an existing user. ALLOWED_EMAIL_DOMAINS (comma-separated) narrows it further.
 */
export const googleLoginPlugin = (): Plugin =>
  OAuth2Plugin({
    enabled: googleLoginActive,
    strategyName: 'google',
    useEmailAsIdentity: true,
    serverURL: serverUrl,
    authCollection: 'users',
    clientId: process.env.GOOGLE_LOGIN_CLIENT_ID || '',
    subFieldName: 'sub',
    clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET || '',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
    ],
    providerAuthorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    getUserInfo: async (accessToken: string) => {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const user = await response.json()
      if (!user.email_verified) {
        throw new Error('Email not verified')
      }
      const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',')
      if (allowedDomains && !allowedDomains.includes(user.email.split('@')?.[1])) {
        throw new Error('Email domain not allowed')
      }

      return {
        email: user.email,
        sub: user.sub,
        name: user.name,
      }
    },
    successRedirect: (req: PayloadRequest) => {
      const state = typeof req.query.state === 'string' ? req.query.state : ''

      // Only allow local root-relative paths, not protocol-relative redirects.
      if (state.startsWith('/') && !state.startsWith('//') && !state.startsWith('/\\')) {
        return state
      }
      return '/admin'
    },
    failureRedirect: (_, error) => {
      console.error(error)
      return '/login'
    },
  })
