'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const showDebugDetails = process.env.NODE_ENV !== 'production'

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="container flex min-h-screen max-w-3xl flex-col items-start justify-center gap-4 py-16">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
            Application error
          </p>
          <h1 className="text-3xl font-semibold">The app needs a fresh start.</h1>
          <p className="text-muted-foreground max-w-2xl">
            Try again in a moment. If this keeps happening, an administrator should review the
            server logs.
          </p>
          {showDebugDetails ? (
            <pre className="bg-muted w-full overflow-x-auto rounded-lg p-4 text-sm">
              {error.message}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2"
          >
            Retry
          </button>
        </main>
      </body>
    </html>
  )
}
