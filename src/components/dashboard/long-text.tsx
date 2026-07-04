'use client'

import * as React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/utils'

export interface LongTextProps {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function LongText({ children, className = '', contentClassName = '' }: LongTextProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isOverflown, setIsOverflown] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const updateOverflow = () => {
      setIsOverflown(node.offsetHeight < node.scrollHeight || node.offsetWidth < node.scrollWidth)
    }

    updateOverflow()

    const observer = new ResizeObserver(updateOverflow)
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  if (!isOverflown) {
    return (
      <div ref={ref} className={cn('truncate', className)}>
        {children}
      </div>
    )
  }

  return (
    <>
      <div className="hidden sm:block">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div ref={ref} className={cn('truncate', className)}>
                {children}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className={contentClassName}>{children}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <div ref={ref} className={cn('truncate', className)}>
              {children}
            </div>
          </PopoverTrigger>
          <PopoverContent className={cn('w-fit max-w-xs', contentClassName)}>
            <p>{children}</p>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
