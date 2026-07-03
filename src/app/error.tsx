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
      <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
        Something went wrong
      </p>
      <h1 className="text-3xl font-semibold">We hit an unexpected error.</h1>
      <p className="text-muted-foreground max-w-2xl">
        Please try again. If the problem continues, refresh the page or contact an administrator.
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
        Try again
      </button>
    </div>
  )
}
