'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { cn } from '@/utils'

export interface NavItem {
  href: string
  label: string
}

/**
 * The header's links. A client component only to mark the current page
 * (`aria-current`) and to open and close the phone menu.
 */
export function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const link = (item: NavItem, className: string) => (
    <Link
      href={item.href}
      aria-current={isCurrent(item.href) ? 'page' : undefined}
      onClick={() => setOpen(false)}
      className={cn(
        className,
        'transition-colors hover:text-foreground aria-[current=page]:text-foreground',
      )}
    >
      {item.label}
    </Link>
  )

  return (
    <>
      <nav aria-label="Main" className="max-lg:hidden">
        <ul className="flex items-center gap-6 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item.href}>
              {link(
                item,
                'underline-offset-[6px] aria-[current=page]:underline aria-[current=page]:decoration-brand',
              )}
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="-mr-2 inline-flex size-10 items-center justify-center rounded-md lg:hidden"
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-background lg:hidden"
      >
        <ul className="container flex flex-col py-4 text-lg text-muted-foreground">
          {items.map((item) => (
            <li key={item.href}>{link(item, 'block py-2.5')}</li>
          ))}
        </ul>
      </nav>
    </>
  )
}
