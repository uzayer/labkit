'use client'

import * as React from 'react'

import { CommandMenu } from '@/components/dashboard/command-menu'

export interface SearchContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggleOpen: () => void
}

export interface SearchProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SearchContext = React.createContext<SearchContextValue | null>(null)

export function SearchProvider({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: SearchProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(nextOpen)
        return
      }

      setUncontrolledOpen(nextOpen)
    },
    [onOpenChange],
  )

  const toggleOpen = React.useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(!open)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, setOpen])

  const value = React.useMemo<SearchContextValue>(
    () => ({
      open,
      setOpen,
      toggleOpen,
    }),
    [open, setOpen, toggleOpen],
  )

  return (
    <SearchContext.Provider value={value}>
      {children}
      <CommandMenu />
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const searchContext = React.useContext(SearchContext)

  if (!searchContext) {
    throw new Error('useSearch must be used within a SearchProvider.')
  }

  return searchContext
}

export function useOptionalSearch() {
  return React.useContext(SearchContext)
}
