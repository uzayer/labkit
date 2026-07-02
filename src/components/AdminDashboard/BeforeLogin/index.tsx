import React from 'react'

const BeforeLogin: React.FC = () => {
  const demoCredentials =
    process.env.NODE_ENV !== 'production'
      ? process.env.NEXT_PUBLIC_DEMO_DASHBOARD_CREDENTIALS
      : undefined

  return (
    <div>
      <p>
        {demoCredentials ? (
          <>
            <b>Welcome to the demo dashboard!</b>
            <br />
            <br />
            Use these credentials below to log in as the demo user:
            <br />
            <b>Email:</b> {demoCredentials.split(':')?.[0]}
            <br />
            <b>Password:</b> {demoCredentials.split(':')?.[1]}
            <br />
            The demo environment gets reset daily at 12:00 UTC and 00:00 UTC.
            <br />
            <br />
          </>
        ) : (
          <>
            <b>Welcome to your dashboard!</b>
            {' This is where site admins will log in to manage your website.'}
            <br />
            <br />
          </>
        )}
      </p>
    </div>
  )
}

export default BeforeLogin
