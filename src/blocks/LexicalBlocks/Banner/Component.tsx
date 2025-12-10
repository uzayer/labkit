import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Icon } from '@/components/Icon'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props & { publicContext: PublicContextProps }> = ({
  className,
  content,
  title,
  style,
  icon,
  publicContext,
}) => {
  // Map banner style to alert variant
  const getAlertVariant = () => {
    switch (style) {
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  // Get appropriate CSS classes based on style
  const getAlertClasses = () => {
    switch (style) {
      case 'info':
        return 'border-border'
      case 'error':
        return 'border-destructive/50 text-destructive dark:border-destructive'
      case 'success':
        return 'border-success bg-success/30'
      case 'warning':
        return 'border-warning bg-warning/30'
      default:
        return ''
    }
  }

  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <Alert className={cn(getAlertClasses())} variant={getAlertVariant()}>
        {icon && <Icon icon={icon} className="h-4 w-4" />}
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>
          {content && (
            <RichText
              publicContext={publicContext}
              overrideStyle={{ p: 'm-0 text-muted-foreground' }}
              content={content}
              withWrapper={false}
            />
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
