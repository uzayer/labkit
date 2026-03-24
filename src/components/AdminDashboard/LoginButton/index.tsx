'use client'

import { FcGoogle } from 'react-icons/fc'
import './index.scss'
import Link from 'next/link'

const LoginButton = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          gap: '1rem',
          width: '100%',
          marginTop: '-10px',
        }}
      >
        <div style={{ flex: 1, height: 1, background: 'var(--border, #E5E7EB)' }} />
        <span style={{ color: 'var(--muted-foreground, #6B7280)', fontWeight: 500, fontSize: 10 }}>
          OR
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border, #E5E7EB)' }} />
      </div>
      <Link
        href="/api/users/oauth/authorize"
        className="login-button btn btn--style-secondary btn--size-large btn--icon-style-without-border"
        prefetch={false}
      >
        <FcGoogle className="login-button__icon" />
        Sign in with Google
      </Link>
    </>
  )
}

export default LoginButton
