import { Menu } from 'lucide-react'
import type { Header as HeaderType } from '@/payload-types'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { LanguageSwitcher, LanguageSwitcherMobile } from '@/components/LanguageSwitcher'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { SearchButton } from '@/search/Component'

export const Navbar1: React.FC<{ header: HeaderType; publicContext: PublicContextProps }> = ({
  header,
  publicContext,
}) => {
  return (
    <section className="z-50 py-32">
      <div className="container">
        {/* Desktop Navigation */}
        <nav className="z-50 hidden justify-between lg:flex">
          <div className="z-50 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Media resource={header.logo} priority />
            </div>
            <div className="flex items-center">
              {/* Left Link Group */}
              <NavigationMenu>
                <NavigationMenuList>
                  {header.items?.map((item) => {
                    if (item.blockType === 'link') {
                      // Single Nav Link
                      return (
                        <CMSLink
                          publicContext={publicContext}
                          key={item.id}
                          {...item.link}
                          className={cn(
                            'text-muted-foreground',
                            navigationMenuTriggerStyle,
                            buttonVariants({
                              variant: 'ghost',
                            }),
                          )}
                        />
                      )
                    } else if (item.blockType === 'sub') {
                      // Sub Nav Group
                      return (
                        <NavigationMenuItem key={item.id} className="text-muted-foreground">
                          <NavigationMenuTrigger>
                            {item.icon && <Icon className={'mr-2 h-6'} icon={item.icon} />}
                            <span>{item.label}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="w-80 p-3">
                              <NavigationMenuLink asChild>
                                {item.subitems.map((subitem) => (
                                  <li key={subitem.id}>
                                    <CMSLink
                                      publicContext={publicContext}
                                      className={cn(
                                        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex gap-4 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none',
                                      )}
                                      {...subitem.link}
                                      label=""
                                      iconBefore={undefined}
                                      iconAfter={undefined}
                                    >
                                      {subitem.link.iconBefore && (
                                        <Icon icon={subitem.link.iconBefore} />
                                      )}
                                      <div>
                                        <div className="text-sm font-semibold">
                                          {subitem.link.label}
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-snug">
                                          {subitem.Description}
                                        </p>
                                      </div>
                                    </CMSLink>
                                  </li>
                                ))}
                              </NavigationMenuLink>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      )
                    }
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {/* Right Button Group */}
          <div className="z-50 flex gap-2">
            {header?.buttons?.map((btn) => (
              <CMSLink publicContext={publicContext} key={btn.id} {...btn.link} size="sm" />
            ))}
            <LanguageSwitcher publicContext={publicContext} size="sm" />
            {header.isSearchEnabled && (
              <SearchButton className="hidden self-center lg:block" publicContext={publicContext} />
            )}
          </div>
          {/* Search Button */}
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Media resource={header.logo} />
            </div>
            {header.isSearchEnabled && (
              <SearchButton
                className="ml-auto block lg:hidden"
                variant="outline"
                publicContext={publicContext}
              />
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={'outline'} size={'icon'}>
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <Media resource={header.logo} />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                {/* Link Group */}
                <div className="my-8 flex flex-col gap-4">
                  <Accordion type="single" collapsible>
                    <LanguageSwitcherMobile publicContext={publicContext} />
                    {header.items?.map((item) => {
                      if (item.blockType === 'link') {
                        // Single Nav Link
                        return (
                          <CMSLink
                            publicContext={publicContext}
                            key={item.id}
                            {...item.link}
                            className="font-semibold"
                          />
                        )
                      } else if (item.blockType === 'sub') {
                        // Sub Nav Group
                        return (
                          <AccordionItem
                            key={item.id}
                            value={item.id || item.label}
                            className="border-b-0"
                          >
                            <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">
                              <span className="inline-flex">
                                {item.icon && <Icon className={'mr-2 h-6'} icon={item.icon} />}
                                {item.label}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="mt-2">
                              {item.subitems.map((subitem) => (
                                <CMSLink
                                  publicContext={publicContext}
                                  key={subitem.id}
                                  className={cn(
                                    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex gap-4 rounded-md p-3 leading-none outline-hidden transition-colors select-none',
                                  )}
                                  {...subitem.link}
                                  label=""
                                  iconBefore={undefined}
                                  iconAfter={undefined}
                                >
                                  {subitem.link.iconBefore && (
                                    <Icon icon={subitem.link.iconBefore} />
                                  )}
                                  <div>
                                    <div className="text-sm font-semibold">
                                      {subitem.link.label}
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-snug">
                                      {subitem.Description}
                                    </p>
                                  </div>
                                </CMSLink>
                              ))}
                            </AccordionContent>
                          </AccordionItem>

                          /* <NavigationMenuItem key={item.id} className="text-muted-foreground">
                          <NavigationMenuTrigger>
                            {item.icon && <Icon className={"mr-2 h-6"} icon={item.icon} />}<span>{item.label}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="w-80 p-3">
                              <NavigationMenuLink>
                                {item.subitems.map((subitem) => (
                                  <li key={subitem.id}>
                                    <CMSLink
                                      className={cn('flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',)}
                                      {...subitem.link}
                                      label=""
                                      iconBefore={undefined}
                                      iconAfter={undefined}
                                    >
                                      {subitem.link.iconBefore && <Icon icon={subitem.link.iconBefore} />}
                                      <div>
                                        <div className="text-sm font-semibold">
                                          {subitem.link.label}
                                        </div>
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {subitem.Description}
                                        </p>
                                      </div>
                                    </CMSLink>
                                  </li>
                                ))}
                              </NavigationMenuLink>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem> */
                        )
                      }
                    })}
                  </Accordion>
                </div>

                {/* Button group */}
                <div className="border-t pt-4">
                  {/* Mobile only button grid - Not implemented yet via CMS */}
                  {/* <div className="grid grid-cols-2 justify-start">
                    <a
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'justify-start text-muted-foreground',
                      )}
                      href="#"
                    >
                      Press
                    </a>
                    <a
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'justify-start text-muted-foreground',
                      )}
                      href="#"
                    >
                      Contact
                    </a>
                    ...
                  </div> */}
                  <div className="mt-2 flex flex-col gap-3">
                    {header?.buttons?.map((btn) => (
                      <CMSLink publicContext={publicContext} key={btn.id} {...btn.link} />
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  )
}
