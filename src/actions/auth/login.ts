'use server'
// Payload offers pre-build server functions to handle authentication: https://payloadcms.com/docs/local-api/server-functions#login

import config from '@payload-config'
import { login as payloadLogin, logout as payloadLogout } from '@payloadcms/next/auth'

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
  } catch (error: any) {
    throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function logout() {
  try {
    const res = await payloadLogout({
      config,
    })
    return res
  } catch (error: any) {
    throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
