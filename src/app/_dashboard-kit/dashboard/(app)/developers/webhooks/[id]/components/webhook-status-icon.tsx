import { CircleCheck, CircleMinus } from 'lucide-react'

interface Props {
  status: boolean
}

export function WebhookStatusIcon({ status }: Props) {
  if (status) {
    return <CircleCheck size={18} className="fill-green-500 stroke-background" />
  }

  return <CircleMinus size={18} className="fill-muted-foreground/75 stroke-background" />
}
