import localization, { locales, localeLabels } from '@/localization.config'
import { Check, Globe } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { cn } from '@/utilities'
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

export const LanguageSwitcher: React.FC<{
  publicContext: PublicContextProps
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'clear'
}> = ({ publicContext, size = 'default' }) => {
  const { cleanSlugs, locale: currentLocale } = publicContext
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="text-muted-foreground hover:bg-card hover:text-accent-foreground rounded-md">
          <NavigationMenuTrigger
            className={cn(
              size === 'sm' && 'h-9 rounded-md px-3 text-sm font-medium',
              size === 'lg' && 'h-11 rounded-md px-8',
              size === 'icon' && 'h-10 w-10',
              size === 'clear' && 'h-auto px-0 py-0',
            )}
          >
            <Globe className={cn('mr-2', size === 'sm' ? 'h-4 w-4' : 'h-4')} />
            {localeLabels[currentLocale]}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="p-3">
              {locales.map((locale) => {
                const langPrefix = locale === localization.defaultLocale ? '' : `/${locale}`
                const href =
                  (cleanSlugs?.[0] === 'home'
                    ? langPrefix
                    : `${langPrefix}/${cleanSlugs?.join('/')}`) || '/'
                if (currentLocale === locale) {
                  return (
                    <span
                      key={locale}
                      className="text-accent-foreground bg-card mb-1 flex w-[85px] items-center justify-start rounded-md p-2"
                    >
                      {localeLabels[locale]} <Check className="ml-2 h-4 w-4" />
                    </span>
                  )
                } else {
                  return (
                    <Link
                      key={locale}
                      href={href}
                      lang={locale}
                      className="hover:text-accent-foreground hover:bg-card mb-1 flex w-[85px] items-center justify-start rounded-md p-2"
                    >
                      {localeLabels[locale]}
                    </Link>
                  )
                }
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export const LanguageSwitcherMobile: React.FC<{ publicContext: PublicContextProps }> = ({
  publicContext,
}) => {
  const { cleanSlugs, locale: currentLocale } = publicContext
  return (
    <AccordionItem value="language-switcher" className="border-b-0">
      <AccordionTrigger className="py-0 font-medium hover:no-underline">
        <span className="inline-flex items-center justify-start">
          <Globe className={'-ml-1 h-4'} />
          {localeLabels[currentLocale]}
        </span>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {locales.map((locale) => {
          const langPrefix = locale === localization.defaultLocale ? '' : `/${locale}`
          const href =
            (cleanSlugs?.[0] === 'home' ? langPrefix : `${langPrefix}/${cleanSlugs?.join('/')}`) ||
            '/'
          if (currentLocale === locale) {
            return (
              <span
                key={locale}
                className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex gap-4 rounded-md p-3 text-sm leading-none font-semibold outline-hidden transition-colors select-none"
              >
                {localeLabels[locale]} <Check className="ml-2 h-4 w-4" />
              </span>
            )
          } else {
            return (
              <Link
                key={locale}
                href={href}
                lang={locale}
                className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex gap-4 rounded-md p-3 text-sm leading-none font-semibold outline-hidden transition-colors select-none"
              >
                {localeLabels[locale]}
              </Link>
            )
          }
        })}
      </AccordionContent>
    </AccordionItem>
  )
}
