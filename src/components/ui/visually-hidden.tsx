import * as React from 'react'
import { cn } from '@/utilities'

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'absolute h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,0,0,0)]',
        className,
      )}
      {...props}
    />
  ),
)
VisuallyHidden.displayName = 'VisuallyHidden'

export { VisuallyHidden }
