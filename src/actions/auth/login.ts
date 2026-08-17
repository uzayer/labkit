'use server'
// Payload offers pre-build server functions to handle authentication: https://payloadcms.com/docs/local-api/server-functions#login

import config from '@payload-config'
import { login as payloadLogin, logout as payloadLogout } from '@payloadcms/next/auth'

const LOGIN_ERROR_MESSAGE = 'Unable to sign in with those credentials.'

function logLoginFailure(error: unknown) {
  // Keep the provider error in server logs for diagnosis, but never include
  // credentials or the provider message in the error sent to the client.
  console.error('[auth] login_failed', error)
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export async function login(formData: LoginFormData) {
  try {
    const result = await payloadLogin({
      collection: 'users',
      config,
      email: formData.email,
      password: formData.password,
    })
    return result
  } catch (error: unknown) {
    logLoginFailure(error)
    throw new Error(LOGIN_ERROR_MESSAGE)
  }
}

export async function logout() {
  try {
    const res = await payloadLogout({
      config,
    })
    return res
  } catch (error: unknown) {
    throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
