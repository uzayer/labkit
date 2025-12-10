import * as React from 'react'
import type { Page } from '@/payload-types'
import { cn } from '@/utilities'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PublicContextProps } from '@/utilities/publicContextProps'
import localization from '@/localization.config'
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
        <BreadcrumbList className={cn('text-muted-foreground text-sm', className)}>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-foreground transition-colors duration-200"
              asChild
            >
              <Link href={localePrefix || '/'}>Home</Link>
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
                    className="hover:text-foreground transition-colors duration-200"
                    asChild
                  >
                    <Link href={localePrefix + item.url || '#'}>{item.label}</Link>
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
