'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(() => {
    if (!canUseDOM) return undefined

    const storedPreference = window.localStorage.getItem(themeLocalStorageKey)
    if (themeIsValid(storedPreference)) {
      return storedPreference
    }

    const implicitPreference = getImplicitPreference()
    if (implicitPreference) {
      return implicitPreference
    }

    return defaultTheme
  })

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (!canUseDOM) return

    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      const implicitPreference = getImplicitPreference()
      setThemeState(implicitPreference || defaultTheme)
    } else {
      setThemeState(themeToSet)
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
    }
  }, [])

  useEffect(() => {
    if (!canUseDOM || !theme) return

    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <ThemeContext.Provider value={{ setTheme, theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
