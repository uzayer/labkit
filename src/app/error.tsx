'use client'

import { useEffect } from 'react'

export default function Error({
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
    <div className="container flex min-h-[60vh] max-w-3xl flex-col items-start justify-center gap-4 py-16">
      <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Something went wrong
      </p>
      <h1 className="text-3xl font-semibold">We hit an unexpected error.</h1>
      <p className="max-w-2xl text-muted-foreground">
        Please try again. If the problem continues, refresh the page or contact an administrator.
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
        Try again
      </button>
    </div>
  )
}
