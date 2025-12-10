'use client'

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Cloud,
  Fingerprint,
  Lock,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { SearchButton } from '@/search/Component'

const solutions = [
  {
    title: 'First solution',
    description: 'Vestibulum scelerisque quis nisl ut convallis.',
    href: '#',
    icon: Cloud,
  },
  {
    title: 'Another solution',
    description: 'Curabitur vehicula malesuada enim a cursus.',
    href: '#',
    icon: Lock,
  },
  {
    title: 'And a third solution',
    description: 'Proin aliquam feugiat lobortis.',
    href: '#',
    icon: Fingerprint,
  },
]

const useCases = [
  {
    title: 'Banking',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'Healthcare',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'Technology',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'Education',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'Agriculture',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'BaaS',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'Entertainment',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'SaaS',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'Crypto',
    href: '#',
    icon: CircleCheckBig,
  },
]

const documentationLinks = [
  {
    title: 'External link',
    href: '#',
  },
  {
    title: 'External link',
    href: '#',
  },
  {
    title: 'External link',
    href: '#',
  },
  {
    title: 'External link',
    href: '#',
  },
]

const resources = [
  {
    title: 'Blog',
    description: 'Vivamus ut risus accumsan, tempus sapien eget.',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'Guides',
    description: 'In sapien tellus, sodales in pharetra a, mattis ac turpis.',
    href: '#',
    icon: CircleCheckBig,
  },
  {
    title: 'News',
    description: 'Maecenas eget orci ac nulla tempor tincidunt.',
    href: '#',
    icon: CircleCheckBig,
  },
]

export const Navbar3: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [open, setOpen] = useState(false)
  const [submenu, setSubmenu] = useState<
    'platform' | 'usecases' | 'developers' | 'resources' | null
  >(null)
  return (
    <div className="bg-background fixed inset-x-0 top-0 z-50">
      <div className="container">
        <NavigationMenu className="min-w-full">
          <div className="flex w-full items-center justify-between gap-12 py-4">
            <div>
              {(!open || !submenu) && (
                <a href="#">
                  <img
                    src="https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg"
                    alt="Logo"
                    className="h-auto w-[125px]"
                  />
                </a>
              )}
              {open && submenu && (
                <Button variant="outline" onClick={() => setSubmenu(null)}>
                  Back
                  <ChevronLeft className="ml-2 size-4" />
                </Button>
              )}
            </div>
            <NavigationMenuList className="hidden lg:flex">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-12 2xl:min-w-[calc(1400px-4rem)]">
                  <div className="flex items-start justify-between gap-x-12">
                    <NavigationMenuLink href="#" className="group w-1/3 max-w-[398px]">
                      <div className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg border text-clip">
                        <div>
                          <img
                            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                            alt="Placeholder image"
                            className="h-[190px] w-[398px] object-cover object-center"
                          />
                        </div>
                        <div className="p-5 xl:p-8">
                          <div className="mb-2 text-base">Platform Overview</div>
                          <div className="text-muted-foreground text-sm font-normal">
                            Pellentesque nec odio id elit dapibus rutrum.
                          </div>
                        </div>
                      </div>
                    </NavigationMenuLink>
                    <div className="max-w-[760px] flex-1 pt-2.5">
                      <div className="text-muted-foreground mb-10 text-xs tracking-widest uppercase">
                        Solutions
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        {solutions.map((solution) => (
                          <NavigationMenuLink
                            key={solution.href}
                            href={solution.href}
                            className="group block"
                          >
                            <div className="mb-5 group-hover:opacity-60">
                              <solution.icon className="size-6" />
                            </div>
                            <div className="mb-1 text-base">{solution.title}</div>
                            <div className="text-muted-foreground text-sm font-normal">
                              {solution.description}
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Use cases</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-12 2xl:min-w-[calc(1400px-4rem)]">
                  <div className="flex justify-between gap-x-[52px]">
                    <div className="w-1/2 max-w-[510px] py-2.5">
                      <div className="text-muted-foreground mb-10 text-xs tracking-widest uppercase">
                        Use cases
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {useCases.map((useCase) => (
                          <NavigationMenuLink
                            key={useCase.href}
                            href={useCase.href}
                            className="group flex items-center gap-5"
                          >
                            <div className="group-hover:opacity-60">
                              <useCase.icon className="size-6" />
                            </div>
                            <div className="text-base">{useCase.title}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                    <NavigationMenuLink href="#" className="group max-w-[604px] flex-1">
                      <div className="bg-secondary/30 group-hover:bg-secondary/80 group-focus:bg-secondary/80 flex h-full rounded-lg">
                        <div className="w-2/5 max-w-[210px] shrink-0 rounded-lg text-clip">
                          <img
                            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                            alt="Placeholder image"
                            className="size-full object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-col p-5 xl:p-8">
                          <div className="text-muted-foreground mb-8 text-xs tracking-widest uppercase">
                            For user persona
                          </div>
                          <div className="mt-auto">
                            <div className="mb-4 text-xl">Call to action for user persona</div>
                            <div className="text-muted-foreground text-sm font-normal">
                              Etiam ornare venenatis neque, sit amet suscipit diam pulvinar a.
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-12 2xl:min-w-[calc(1400px-4rem)]">
                  <div className="flex justify-between gap-x-12">
                    <div className="w-1/3 max-w-[404px]">
                      <div className="text-muted-foreground mb-6 text-xs tracking-widest uppercase">
                        Documentation
                      </div>
                      <div className="text-muted-foreground mb-[30px] text-sm font-normal">
                        Call to action for developers
                      </div>
                      <div className="-ml-2.5 space-y-2.5">
                        {documentationLinks.map((documentationLink) => (
                          <NavigationMenuLink
                            key={documentationLink.href}
                            href={documentationLink.href}
                            className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center gap-2.5 rounded-md p-2.5"
                          >
                            <div className="bg-accent group-hover:bg-primary group-hover:text-primary-foreground flex size-5 items-center justify-center rounded">
                              <ArrowUpRight className="size-3" />
                            </div>
                            <div className="text-sm">{documentationLink.title}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                    <div className="max-w-[716px] flex-1 space-y-6">
                      <NavigationMenuLink
                        href="#"
                        className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center rounded-lg border text-clip"
                      >
                        <div className="flex-1 p-5 xl:p-8">
                          <div className="mb-2 text-base">Showcase link</div>
                          <div className="text-muted-foreground text-sm font-normal">
                            Fusce neque dolor, sollicitudin sed sodales non, condimentum vel metus.
                          </div>
                        </div>
                        <div className="h-[154px] max-w-[264px] shrink-0">
                          <img
                            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                            alt="Placeholder image"
                            className="size-full object-cover object-center"
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="#"
                        className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center rounded-lg border text-clip"
                      >
                        <div className="flex-1 p-5 xl:p-8">
                          <div className="mb-2 text-base">Another showcase link</div>
                          <div className="text-muted-foreground text-sm font-normal">
                            Duis metus mauris, efficitur imperdiet magna vitae, accumsan mattis
                            lacus.
                          </div>
                        </div>
                        <div className="h-[154px] max-w-[264px] shrink-0">
                          <img
                            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                            alt="Placeholder image"
                            className="size-full object-cover object-center"
                          />
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-12 2xl:min-w-[calc(1400px-4rem)]">
                  <div className="flex gap-12">
                    <div className="flex flex-1 flex-col">
                      <div className="text-muted-foreground mb-10 text-xs tracking-widest uppercase">
                        Resources
                      </div>
                      <div className="grid flex-1 grid-cols-3 gap-6">
                        {resources.map((resource) => (
                          <NavigationMenuLink
                            key={resource.href}
                            href={resource.href}
                            className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex h-full flex-col rounded-lg border p-5 text-clip xl:p-8"
                          >
                            <div className="mb-8">
                              <resource.icon className="size-6" />
                            </div>
                            <div className="mt-auto">
                              <div className="mb-2 text-base">{resource.title}</div>
                              <div className="text-muted-foreground text-sm font-normal">
                                {resource.description}
                              </div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                    <div className="w-1/3 max-w-[404px]">
                      <div className="text-muted-foreground mb-10 text-xs tracking-widest uppercase">
                        Customers
                      </div>
                      <NavigationMenuLink
                        href="#"
                        className="border-input bg-background hover:bg-accent hover:text-accent-foreground mb-6 flex rounded-lg border text-clip"
                      >
                        <div className="flex-1 p-5 xl:p-8">
                          <div className="mb-2 text-base">Customers</div>
                          <div className="text-muted-foreground text-sm font-normal">
                            Integer a ipsum quis nisi posuere lobortis at id tellus.
                          </div>
                        </div>
                        <div className="w-1/3 max-w-[130px] shrink-0">
                          <img
                            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                            alt="Placeholder image"
                            className="size-full object-cover object-center"
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="#"
                        className="bg-secondary/30 hover:bg-secondary/80 focus:bg-secondary/80 flex items-center gap-3 rounded-lg p-3"
                      >
                        <Badge variant="secondary">NEW</Badge>
                        <span className="text-secondary-foreground text-sm text-ellipsis">
                          Proin volutpat at felis in vehicula
                        </span>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <div className="hidden items-center gap-4 lg:flex"> 
              {/* Search Button */}
              {header.isSearchEnabled && <SearchButton className='hidden md:block'/>}
              <Button variant="ghost">Log in</Button>
              <Button variant="outline">
                Start now
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 lg:hidden">
              <Button
                variant="outline"
                size="icon"
                aria-label="Main Menu"
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
          </div>

          {/* Mobile Menu (Root) */}
          {open && (
            <div className="border-border bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll border-t lg:hidden">
              <div>
                <button
                  type="button"
                  className="border-border flex w-full items-center border-b px-8 py-7 text-left"
                  onClick={() => setSubmenu('platform')}
                >
                  <span className="flex-1">Platform</span>
                  <span className="shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
                <button
                  type="button"
                  className="border-border flex w-full items-center border-b px-8 py-7 text-left"
                  onClick={() => setSubmenu('usecases')}
                >
                  <span className="flex-1">Use cases</span>
                  <span className="shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
                <button
                  type="button"
                  className="border-border flex w-full items-center border-b px-8 py-7 text-left"
                  onClick={() => setSubmenu('developers')}
                >
                  <span className="flex-1">Developers</span>
                  <span className="shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
                <button
                  type="button"
                  className="border-border flex w-full items-center border-b px-8 py-7 text-left"
                  onClick={() => setSubmenu('resources')}
                >
                  <span className="flex-1">Resources</span>
                  <span className="shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
              </div>
              <div className="mx-8 mt-auto flex flex-col gap-4 py-12">
                <Button variant="outline" className="relative" size="lg">
                  Log in
                  <ChevronRight className="absolute right-2 size-4" />
                </Button>
                <Button className="relative" size="lg">
                  Start now
                  <ChevronRight className="absolute right-2 size-4" />
                </Button>
              </div>
            </div>
          )}
          {/* Mobile Menu > Platform */}
          {open && submenu === 'platform' && (
            <div className="border-border bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll border-t lg:hidden">
              <a href="#" className="block space-y-6 p-8">
                <div className="w-full rounded-lg text-clip">
                  <img
                    src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                    alt="Placeholder image"
                    className="aspect-2/1 size-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="mb-2 text-base">Platform Overview</div>
                  <div className="text-muted-foreground text-sm font-normal">
                    Pellentesque nec odio id elit dapibus rutrum.
                  </div>
                </div>
              </a>
              <div className="text-muted-foreground px-8 py-3.5 text-xs tracking-widest uppercase">
                Solutions
              </div>
              <div className="border-border border-t pb-16">
                {solutions.map((solution) => (
                  <a
                    key={solution.href}
                    href={solution.href}
                    className="group border-border hover:bg-accent flex w-full items-start gap-x-4 border-b px-8 py-7 text-left"
                  >
                    <div className="shrink-0">
                      <solution.icon className="size-6" />
                    </div>
                    <div>
                      <div className="mb-1.5 text-base">{solution.title}</div>
                      <div className="text-muted-foreground text-sm font-normal">
                        {solution.description}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          {/* Mobile Menu > Use cases */}
          {open && submenu === 'usecases' && (
            <div className="bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll lg:hidden">
              <div className="text-muted-foreground px-8 py-3.5 text-xs tracking-widest uppercase">
                Use cases
              </div>
              <div>
                {useCases.map((useCase) => (
                  <a
                    key={useCase.href}
                    href={useCase.href}
                    className="group border-border hover:bg-accent flex w-full items-start gap-x-4 border-t px-8 py-7 text-left"
                  >
                    <div className="shrink-0">
                      <useCase.icon className="size-6" />
                    </div>
                    <div className="text-base">{useCase.title}</div>
                  </a>
                ))}
              </div>
              <div className="bg-secondary/30 px-8 pt-8 pb-16">
                <div className="text-muted-foreground mb-7 text-xs tracking-widest uppercase">
                  For user persona
                </div>
                <a href="#" className="block space-y-6">
                  <div className="rounded-lg text-clip">
                    <img
                      src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                      alt="Placeholder image"
                      className="aspect-2/1 size-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base">Call to action for user persona</div>
                    <div className="text-muted-foreground text-sm font-normal">
                      Etiam ornare venenatis neque, sit amet suscipit diam pulvinar a.
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}
          {/* Mobile Menu > Developers */}
          {open && submenu === 'developers' && (
            <div className="border-border bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll border-t lg:hidden">
              <a href="#" className="block space-y-6 p-8">
                <div className="w-full rounded-lg text-clip">
                  <img
                    src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                    alt="Placeholder image"
                    className="aspect-2/1 size-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="mb-2 text-base">Start with our API</div>
                  <div className="text-muted-foreground text-sm font-normal">
                    Head to our developer documentation for all the help you need to embed our
                    payments API.
                  </div>
                </div>
              </a>
              <a href="#" className="border-border block space-y-6 border-t p-8">
                <div className="w-full rounded-lg text-clip">
                  <img
                    src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                    alt="Placeholder image"
                    className="aspect-2/1 size-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="mb-2 text-base">Quick Start</div>
                  <div className="text-muted-foreground text-sm font-normal">
                    Check out our quick-start guides, where you&apos;ll find tips and tricks for
                    everything payments.
                  </div>
                </div>
              </a>
              <div className="text-muted-foreground px-8 py-3.5 text-xs tracking-widest uppercase">
                Documentation
              </div>
              <div className="-mx-2.5 space-y-2.5 px-8 pb-16">
                {documentationLinks.map((documentationLink) => (
                  <NavigationMenuLink
                    key={documentationLink.href}
                    href={documentationLink.href}
                    className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center gap-2.5 rounded-md px-2.5 py-[18px]"
                  >
                    <div className="bg-accent group-hover:bg-primary group-hover:text-primary-foreground flex size-5 items-center justify-center rounded">
                      <ArrowUpRight className="size-3" />
                    </div>
                    <div className="text-sm">{documentationLink.title}</div>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          )}
          {/* Mobile Menu > Platform */}
          {open && submenu === 'resources' && (
            <div className="bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll lg:hidden">
              <div className="text-muted-foreground px-8 py-3.5 text-xs tracking-widest uppercase">
                Resources
              </div>
              <div>
                {resources.map((resource) => (
                  <a
                    key={resource.href}
                    href={resource.href}
                    className="group border-border hover:bg-accent flex w-full items-start gap-x-4 border-t px-8 py-7 text-left"
                  >
                    <div className="shrink-0">
                      <resource.icon className="size-6" />
                    </div>
                    <div>
                      <div className="mb-1.5 text-base">{resource.title}</div>
                      <div className="text-muted-foreground text-sm font-normal">
                        {resource.description}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="px-8 pt-8 pb-16">
                <div className="text-muted-foreground mb-7 text-xs tracking-widest uppercase">
                  Customers
                </div>
                <a href="#" className="block space-y-6">
                  <div className="rounded-lg text-clip">
                    <img
                      src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                      alt="Placeholder image"
                      className="aspect-2/1 size-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base">Customers</div>
                    <div className="text-muted-foreground text-sm font-normal">
                      Meet the product teams changing how they process payments.
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}
        </NavigationMenu>
      </div>
    </div>
  )
}

export default Navbar3
