import Link from 'next/link'
import { BackButton } from '../back-button'
import { Button } from '../ui/button'

export default function UnauthorizedError() {
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">401</h1>
        <span className="font-medium">Unauthorized Access</span>
        <p className="text-center text-muted-foreground">
          Please log in with the appropriate credentials <br /> to access this resource.
        </p>
        <div className="mt-6 flex gap-4">
          <BackButton />
          <Button render={<Link href="/dashboard" />} nativeButton={false} role="link">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
