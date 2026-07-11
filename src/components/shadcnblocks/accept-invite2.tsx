import { Button } from '@/components/ui/button'
import { cn } from '@/utils'

interface AcceptInvite2Props {
  className?: string
  hostName?: string
  description?: string
}

const AcceptInvite2 = ({
  className,
  hostName = 'Sarah Johnson',
  description = 'Join their workspace to collaborate and get access to their resources.',
}: AcceptInvite2Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div
          className={cn(
            'mx-auto w-fit space-y-12 rounded-xl border px-6 pt-12 pb-10 shadow-lg',
            className,
          )}
        >
          <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
            <span className="flex size-32 items-center justify-center rounded-full bg-muted text-6xl font-medium">
              {hostName.charAt(0)}
            </span>
            <p className="mt-2 text-2xl">
              <span className="font-medium">{hostName}</span>
              <span className="font-light"> invited you to join their workspace.</span>
            </p>
            <p className="max-w-sm text-muted-foreground">{description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Button size="lg" variant="outline">
                Decline
              </Button>
              <Button size="lg">Accept Invite</Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Invitation expires in 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { AcceptInvite2 }
