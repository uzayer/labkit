import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { ThemeConfig } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

export async function ThemeConfig({ publicContext }: { publicContext: PublicContextProps }) {
  const themeConfig: ThemeConfig = await getCachedGlobal('themeConfig', publicContext.locale, 2)()

  return (
    <style
      id="theme-config"
      dangerouslySetInnerHTML={{
        __html:
          `
:root { 
  --radius: ${themeConfig.radius};

  --background: ${themeConfig.regularColors?.background};
  --foreground: ${themeConfig.regularColors?.foreground};
  --card: ${themeConfig.regularColors?.card};
  --card-foreground: ${themeConfig.regularColors?.['card-foreground']};

  --popover: ${themeConfig.regularColors?.popover};
  --popover-foreground: ${themeConfig.regularColors?.['popover-foreground']};

  --primary: ${themeConfig.regularColors?.primary};
  --primary-foreground: ${themeConfig.regularColors?.['primary-foreground']};

  --secondary: ${themeConfig.regularColors?.secondary};
  --secondary-foreground: ${themeConfig.regularColors?.['secondary-foreground']};

  --muted: ${themeConfig.regularColors?.muted};
  --muted-foreground: ${themeConfig.regularColors?.['muted-foreground']};

  --accent: ${themeConfig.regularColors?.accent};
  --accent-foreground: ${themeConfig.regularColors?.['accent-foreground']};

  --destructive: ${themeConfig.regularColors?.destructive};
  --destructive-foreground: ${themeConfig.regularColors?.['destructive-foreground']};

  --border: ${themeConfig.regularColors?.border};
  --input: ${themeConfig.regularColors?.input};
  --ring: ${themeConfig.regularColors?.['ring-3']};

  --success: ${themeConfig.regularColors?.success};
  --warning: ${themeConfig.regularColors?.warning};
  --error: ${themeConfig.regularColors?.error};

  --chart-1: ${themeConfig.regularColors?.['chart-1']};
  --chart-2: ${themeConfig.regularColors?.['chart-2']};
  --chart-3: ${themeConfig.regularColors?.['chart-3']};
  --chart-4: ${themeConfig.regularColors?.['chart-4']};
  --chart-5: ${themeConfig.regularColors?.['chart-5']};

  --muted2: ${themeConfig.regularColors?.muted2};
  --muted2-foreground: ${themeConfig.regularColors?.['muted2-foreground']};
}` +
          (themeConfig.darkmodeColors?.enableDarkMode
            ? `

        
[data-theme='dark'] {
  --background: ${themeConfig.darkmodeColors?.background};
  --foreground: ${themeConfig.darkmodeColors?.foreground};

  --card: ${themeConfig.darkmodeColors?.card};
  --card-foreground: ${themeConfig.darkmodeColors?.['card-foreground']};

  --popover: ${themeConfig.darkmodeColors?.popover};
  --popover-foreground: ${themeConfig.darkmodeColors?.['popover-foreground']};

  --primary: ${themeConfig.darkmodeColors?.primary};
  --primary-foreground: ${themeConfig.darkmodeColors?.['primary-foreground']};

  --secondary: ${themeConfig.darkmodeColors?.secondary};
  --secondary-foreground: ${themeConfig.darkmodeColors?.['secondary-foreground']};

  --muted: ${themeConfig.darkmodeColors?.muted};
  --muted-foreground: ${themeConfig.darkmodeColors?.['muted-foreground']};

  --accent: ${themeConfig.darkmodeColors?.accent};
  --accent-foreground: ${themeConfig.darkmodeColors?.['accent-foreground']};

  --destructive: ${themeConfig.darkmodeColors?.destructive};
  --destructive-foreground: ${themeConfig.darkmodeColors?.['destructive-foreground']};

  --border: ${themeConfig.darkmodeColors?.border};
  --input: ${themeConfig.darkmodeColors?.input};
  --ring: ${themeConfig.darkmodeColors?.['ring-3']};

  --success: ${themeConfig.darkmodeColors?.success};
  --warning: ${themeConfig.darkmodeColors?.warning};
  --error: ${themeConfig.darkmodeColors?.error};
}`
            : ''),
      }}
    />
  )
}
