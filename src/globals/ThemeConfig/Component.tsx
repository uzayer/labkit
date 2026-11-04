import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
// Aliased: the component below is also named ThemeConfig, and oxlint --fix
// (pre-commit) deletes the unaliased type import as unused.
import type { ThemeConfig as ThemeConfigData } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { sanitizeThemeColorValue, sanitizeThemeRadiusValue } from '@labkit/core/validation'

function buildThemeDeclarationBlock(
  selector: string,
  values: Record<string, string | null | undefined>,
): string {
  const declarations = Object.entries(values)
    .filter(([, value]) => typeof value === 'string' && value.length > 0)
    .map(([name, value]) => `  --${name}: ${value};`)

  if (!declarations.length) return ''

  return `${selector} {\n${declarations.join('\n')}\n}`
}

export async function ThemeConfig({ publicContext }: { publicContext: PublicContextProps }) {
  const themeConfig: ThemeConfigData = await getCachedGlobal(
    'themeConfig',
    publicContext.locale,
    2,
  )()
  const lightThemeCss = buildThemeDeclarationBlock(':root', {
    radius: sanitizeThemeRadiusValue(themeConfig.radius),
    background: sanitizeThemeColorValue(themeConfig.regularColors?.background),
    foreground: sanitizeThemeColorValue(themeConfig.regularColors?.foreground),
    card: sanitizeThemeColorValue(themeConfig.regularColors?.card),
    'card-foreground': sanitizeThemeColorValue(themeConfig.regularColors?.['card-foreground']),
    popover: sanitizeThemeColorValue(themeConfig.regularColors?.popover),
    'popover-foreground': sanitizeThemeColorValue(
      themeConfig.regularColors?.['popover-foreground'],
    ),
    primary: sanitizeThemeColorValue(themeConfig.regularColors?.primary),
    'primary-foreground': sanitizeThemeColorValue(
      themeConfig.regularColors?.['primary-foreground'],
    ),
    secondary: sanitizeThemeColorValue(themeConfig.regularColors?.secondary),
    'secondary-foreground': sanitizeThemeColorValue(
      themeConfig.regularColors?.['secondary-foreground'],
    ),
    muted: sanitizeThemeColorValue(themeConfig.regularColors?.muted),
    'muted-foreground': sanitizeThemeColorValue(themeConfig.regularColors?.['muted-foreground']),
    accent: sanitizeThemeColorValue(themeConfig.regularColors?.accent),
    'accent-foreground': sanitizeThemeColorValue(themeConfig.regularColors?.['accent-foreground']),
    destructive: sanitizeThemeColorValue(themeConfig.regularColors?.destructive),
    'destructive-foreground': sanitizeThemeColorValue(
      themeConfig.regularColors?.['destructive-foreground'],
    ),
    border: sanitizeThemeColorValue(themeConfig.regularColors?.border),
    input: sanitizeThemeColorValue(themeConfig.regularColors?.input),
    ring: sanitizeThemeColorValue(themeConfig.regularColors?.['ring-3']),
    success: sanitizeThemeColorValue(themeConfig.regularColors?.success),
    warning: sanitizeThemeColorValue(themeConfig.regularColors?.warning),
    error: sanitizeThemeColorValue(themeConfig.regularColors?.error),
    'chart-1': sanitizeThemeColorValue(themeConfig.regularColors?.['chart-1']),
    'chart-2': sanitizeThemeColorValue(themeConfig.regularColors?.['chart-2']),
    'chart-3': sanitizeThemeColorValue(themeConfig.regularColors?.['chart-3']),
    'chart-4': sanitizeThemeColorValue(themeConfig.regularColors?.['chart-4']),
    'chart-5': sanitizeThemeColorValue(themeConfig.regularColors?.['chart-5']),
    muted2: sanitizeThemeColorValue(themeConfig.regularColors?.muted2),
    'muted2-foreground': sanitizeThemeColorValue(themeConfig.regularColors?.['muted2-foreground']),
  })
  const darkThemeCss = themeConfig.darkmodeColors?.enableDarkMode
    ? buildThemeDeclarationBlock("[data-theme='dark']", {
        background: sanitizeThemeColorValue(themeConfig.darkmodeColors?.background),
        foreground: sanitizeThemeColorValue(themeConfig.darkmodeColors?.foreground),
        card: sanitizeThemeColorValue(themeConfig.darkmodeColors?.card),
        'card-foreground': sanitizeThemeColorValue(themeConfig.darkmodeColors?.['card-foreground']),
        popover: sanitizeThemeColorValue(themeConfig.darkmodeColors?.popover),
        'popover-foreground': sanitizeThemeColorValue(
          themeConfig.darkmodeColors?.['popover-foreground'],
        ),
        primary: sanitizeThemeColorValue(themeConfig.darkmodeColors?.primary),
        'primary-foreground': sanitizeThemeColorValue(
          themeConfig.darkmodeColors?.['primary-foreground'],
        ),
        secondary: sanitizeThemeColorValue(themeConfig.darkmodeColors?.secondary),
        'secondary-foreground': sanitizeThemeColorValue(
          themeConfig.darkmodeColors?.['secondary-foreground'],
        ),
        muted: sanitizeThemeColorValue(themeConfig.darkmodeColors?.muted),
        'muted-foreground': sanitizeThemeColorValue(
          themeConfig.darkmodeColors?.['muted-foreground'],
        ),
        accent: sanitizeThemeColorValue(themeConfig.darkmodeColors?.accent),
        'accent-foreground': sanitizeThemeColorValue(
          themeConfig.darkmodeColors?.['accent-foreground'],
        ),
        destructive: sanitizeThemeColorValue(themeConfig.darkmodeColors?.destructive),
        'destructive-foreground': sanitizeThemeColorValue(
          themeConfig.darkmodeColors?.['destructive-foreground'],
        ),
        border: sanitizeThemeColorValue(themeConfig.darkmodeColors?.border),
        input: sanitizeThemeColorValue(themeConfig.darkmodeColors?.input),
        ring: sanitizeThemeColorValue(themeConfig.darkmodeColors?.['ring-3']),
        success: sanitizeThemeColorValue(themeConfig.darkmodeColors?.success),
        warning: sanitizeThemeColorValue(themeConfig.darkmodeColors?.warning),
        error: sanitizeThemeColorValue(themeConfig.darkmodeColors?.error),
      })
    : ''
  const css = [lightThemeCss, darkThemeCss].filter(Boolean).join('\n\n')

  return (
    <style
      id="theme-config"
      dangerouslySetInnerHTML={{
        __html: css,
      }}
    />
  )
}
