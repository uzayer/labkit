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
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Application error
          </p>
          <h1 className="text-3xl font-semibold">The app needs a fresh start.</h1>
          <p className="max-w-2xl text-muted-foreground">
            Try again in a moment. If this keeps happening, an administrator should review the
            server logs.
          </p>
          {showDebugDetails ? (
            <pre className="w-full overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              {error.message}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Retry
          </button>
        </main>
      </body>
    </html>
  )
}
