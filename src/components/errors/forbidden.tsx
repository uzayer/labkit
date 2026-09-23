import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BackButton } from '../back-button'

export default function ForbiddenError() {
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">403</h1>
        <span className="font-medium">Access Forbidden</span>
        <p className="text-center text-muted-foreground">
          You don&apos;t have necessary permission <br />
          to view this resource.
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
