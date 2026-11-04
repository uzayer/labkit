import * as React from 'react'
import type { Page } from '@/payload-types'
import { cn } from '@/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PublicContextProps } from '@/utilities/publicContextProps'
import localization from '@labkit/core/localization'
import Link from 'next/link'

interface BreadcrumbProps {
  items?:
    | {
        doc?: (string | null) | Page
        url?: string | null
        label?: string | null
        id?: string | null
      }[]
    | null
  className?: string
  publicContext?: PublicContextProps
}

export function Breadcrumbs({ items, className, publicContext }: BreadcrumbProps) {
  if (!items?.length) return null
  const localePrefix =
    publicContext?.locale !== localization.defaultLocale ? `/${publicContext?.locale}` : ''
  return (
    <div className="container my-12">
      <Breadcrumb>
        <BreadcrumbList className={cn('text-sm text-muted-foreground', className)}>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="transition-colors duration-200 hover:text-foreground"
              render={<Link href={localePrefix || '/'} />}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {items.map((item, index) => (
            <React.Fragment key={item.id || item.url}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="transition-colors duration-200 hover:text-foreground"
                    render={<Link href={localePrefix + item.url || '#'} />}
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
