import * as React from 'react'

const MOBILE_BREAKPOINT = 768

function getServerSnapshot() {
  return false
}

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    [breakpoint],
  )

  const getSnapshot = React.useCallback(() => window.innerWidth < breakpoint, [breakpoint])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
