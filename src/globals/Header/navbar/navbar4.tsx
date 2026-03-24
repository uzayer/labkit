'use client'

import { ArrowLeft, ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { SearchButton } from '@/search/Component'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { BlockRenderer } from './blocks'

const Navbar4: React.FC<{ header: HeaderType; publicContext: PublicContextProps }> = ({
  header,
  publicContext,
}) => {
  const [open, setOpen] = useState(false)
  const [submenu, setSubmenu] = useState<string | null>(null)

  const navItems = header.richItems || []

  return (
    <section className="bg-background inset-x-0 top-0 z-50">
      <div className="container">
        <NavigationMenu className="relative z-50 min-w-full">
          <div className="flex w-full justify-between gap-2 py-4">
            <CMSLink publicContext={publicContext} url={'/'} className="flex items-center gap-2">
              <Media resource={header.logo} className="h-9" imgClassName="h-full w-auto" priority />
            </CMSLink>
            <div className="flex items-center gap-2 xl:gap-8">
              <NavigationMenuList className="hidden lg:flex">
                {navItems.map((item) => {
                  if (item.blockType === 'link') {
                    return (
                      <NavigationMenuItem key={item.id}>
                        <CMSLink
                          publicContext={publicContext}
                          {...item.link}
                          className="text-xs xl:text-sm"
                        />
                      </NavigationMenuItem>
                    )
                  } else if (item.blockType === 'submenu' && item.blocks) {
                    // Handle submenu (new block-based) navigation type
                    return (
                      <NavigationMenuItem key={item.id}>
                        <NavigationMenuTrigger className="text-xs xl:text-sm">
                          {item.icon && <Icon icon={item.icon} className="mr-2 h-4 w-4" />}
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-50 min-w-[calc(100vw-4rem)] p-12 2xl:min-w-[calc(1400px-4rem)]">
                          <BlockRenderer blocks={item.blocks} publicContext={publicContext} />
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )
                  }
                  return null
                })}
              </NavigationMenuList>
            </div>
            <div className="flex items-center gap-2">
              {header.buttons?.map((btn) => (
                <CMSLink
                  key={btn.id}
                  publicContext={publicContext}
                  {...btn.link}
                  className="hidden items-center justify-center md:inline-flex"
                />
              ))}
              {header.isSearchEnabled && (
                <SearchButton
                  className="mr-0 ml-auto block lg:hidden"
                  variant="ghost"
                  publicContext={publicContext}
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Main Menu"
                className="lg:hidden"
                onClick={() => {
                  if (open) {
                    setOpen(false)
                    setSubmenu(null)
                  } else {
                    setOpen(true)
                  }
                }}
              >
                {!open && <Menu className="size-4" />}
                {open && <X className="size-4" />}
              </Button>
            </div>
            {/* Search Button */}
            {header.isSearchEnabled && (
              <SearchButton className="hidden lg:block" publicContext={publicContext} />
            )}
          </div>

          {/* Mobile Menu */}
          {open && (
            <div className="border-border bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll border-t lg:hidden">
              {submenu && (
                <div className="mt-3 px-[1rem]">
                  <Button variant="link" onClick={() => setSubmenu(null)}>
                    <ArrowLeft className="mr-2 size-4 text-xs" />
                    Go back
                  </Button>
                </div>
              )}
              {submenu === null && (
                <div>
                  {navItems.map((item: any) => {
                    if (item.blockType === 'link') {
                      return (
                        <CMSLink
                          key={item.id}
                          publicContext={publicContext}
                          {...item.link}
                          className="border-border flex w-full items-center border-b px-8 py-6 text-left font-medium"
                        />
                      )
                    } else if (item.blockType === 'submenu' || item.blockType === 'sub') {
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className="border-border flex w-full items-center border-b px-8 py-6 text-left"
                          onClick={() => setSubmenu(item.id as string)}
                        >
                          <span className="flex-1 text-sm font-medium">
                            {item.icon && (
                              <Icon icon={item.icon} className="mr-2 inline-block h-4 w-4" />
                            )}
                            {item.label}
                          </span>
                          <span className="shrink-0">
                            <ArrowRight className="size-4" />
                          </span>
                        </button>
                      )
                    }
                    return null
                  })}
                </div>
              )}

              {/* Dynamic submenu content */}
              {navItems.map((item: any) => {
                if (
                  ((item.blockType === 'submenu' && item.blocks) ||
                    (item.blockType === 'sub' && item.subitems)) &&
                  submenu === item.id
                ) {
                  return (
                    <div key={item.id} className="container">
                      <h2 className="pt-4 pb-6 text-lg font-medium">{item.label}</h2>
                      {item.blockType === 'submenu' && item.blocks && (
                        <BlockRenderer blocks={item.blocks} publicContext={publicContext} />
                      )}
                      {item.blockType === 'sub' && item.subitems && (
                        <div className="grid grid-cols-1 gap-4">
                          {item.subitems.map((subitem) => (
                            <CMSLink
                              key={subitem.id}
                              publicContext={publicContext}
                              {...subitem.link}
                              className="group hover:border-foreground/50 flex flex-col gap-2 rounded-lg border p-4"
                            >
                              {subitem.link.iconBefore && (
                                <Icon icon={subitem.link.iconBefore} className="size-8" />
                              )}
                              <div>
                                <h3 className="font-medium">{subitem.link.label}</h3>
                                <p className="text-muted-foreground text-sm">
                                  {subitem.Description}
                                </p>
                              </div>
                            </CMSLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              })}

              {/* Mobile menu footer */}
              <div className="mx-[2rem] mt-auto flex flex-col items-center gap-8 py-24">
                {header.buttons?.map((btn) => (
                  <CMSLink key={btn.id} publicContext={publicContext} {...btn.link} />
                ))}
                <p className="text-xs">{header.copyright}</p>
              </div>
            </div>
          )}
        </NavigationMenu>
      </div>
    </section>
  )
}

export { Navbar4 }
