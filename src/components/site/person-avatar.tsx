import { cn } from '@/utils'

/**
 * A person's photo, or their initial on a tinted tile where there's none. The
 * photo is decorative next to the name it sits beside, so its alt is empty.
 */
export function PersonAvatar({
  name,
  photo,
  size = 'md',
  className,
}: {
  name: string
  photo: string | null
  size?: 'md' | 'lg'
  className?: string
}) {
  const box = size === 'lg' ? 'size-40 md:size-48 text-6xl' : 'size-14 text-xl'
  if (photo) {
    return (
      // A plain <img>: Media URLs come from whichever storage the Lab uses,
      // and next/image would need each host configured.
      <img
        src={photo}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn('shrink-0 rounded-md bg-muted object-cover', box, className)}
      />
    )
  }
  return (
    <span
      aria-hidden
      className={cn(
        'font-display grid shrink-0 place-items-center rounded-md bg-muted text-muted-foreground',
        box,
        className,
      )}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  )
}
