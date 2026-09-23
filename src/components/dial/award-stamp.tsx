import { RosetteMark } from '@/components/dial/marks'
import { cn } from '@/lib/utils'

/**
 * Who gave an award, set as a stamp line: a rosette, then the awarding body in
 * tracked mono capitals in the second ink.
 *
 * On a phone the awards list collapses to one column, and the body that gave
 * the award used to print in the same muted sans, at the same size, on the
 * same left edge as the paper that earned it — two grey lines nobody could
 * tell apart. The body is the prestige signal ("ACM CHI 2019"), so it gets the
 * voice nothing else on the row uses: the rubber stamp, not the caption.
 */
export function AwardStamp({
  organization,
  category,
  className,
}: {
  organization: string
  /** The kind of award, printed after the body: "Best Paper". */
  category?: string
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-ink flex items-start gap-2 font-mono text-[0.7rem] leading-snug tracking-[0.14em] uppercase',
        className,
      )}
    >
      <RosetteMark className="-mt-0.5 size-4 shrink-0" />
      <span className="text-pretty">
        {organization}
        {category && (
          <>
            <span aria-hidden className="text-ink/50 mx-2">
              /
            </span>
            <span className="text-muted-foreground">{category}</span>
          </>
        )}
      </span>
    </p>
  )
}
