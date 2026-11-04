'use client'

import * as React from 'react'
import { FileText, Loader2, Search } from 'lucide-react'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useDebounce } from '@/utilities/useDebounce'
import { useIsMobile } from '@/hooks/use-mobile'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button, ButtonProps } from '@/components/ui/button'
import { useSearch } from '@/utilities/useSearch'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Locale, localization } from '@labkit/core/localization'

type SearchTranslations = {
  placeholder: string
  esc: string
  searching: string
  noResults: string
  startTyping: string
  recentItems: string
  recentResults: string
  foundResults: (count: number) => string
  search: string
}

type SearchCategory = {
  title: string
}

type SearchResult = {
  id: string
  url: string
  title: string
  description?: string | null
  type: string
  categories?: SearchCategory[] | null
}

const translations: Record<Locale, SearchTranslations> = {
  en: {
    placeholder: 'What are you searching for?',
    esc: 'Esc',
    searching: 'Searching...',
    noResults: 'No results found.',
    startTyping: 'Start typing to search...',
    recentItems: 'Recent Items',
    recentResults: 'Recent Results',
    foundResults: (count) => `Found ${count} result${count !== 1 ? 's' : ''}`,
    search: 'Search',
  },
  // Uncomment to enable German
  // de: {
  //   placeholder: 'Wonach suchen Sie?',
  //   esc: 'Esc',
  //   searching: 'Suche...',
  //   noResults: 'Keine Ergebnisse gefunden.',
  //   startTyping: 'Beginnen Sie zu tippen, um zu suchen...',
  //   recentItems: 'Kürzliche Elemente',
  //   recentResults: 'Kürzliche Ergebnisse',
  //   foundResults: (count) => `${count} Ergebnis${count !== 1 ? 'se' : ''} gefunden`,
  //   search: 'Suchen',
  // },
}

function SearchList({
  value,
  setValue,
  t,
  isLoading,
  debouncedValue,
  displayResults,
  cachedResults,
  results,
  handleSelect,
  setOpen,
}: {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  t: SearchTranslations
  isLoading: boolean
  debouncedValue: string
  displayResults: SearchResult[]
  cachedResults: SearchResult[]
  results: SearchResult[]
  handleSelect: (url: string) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <>
      <div className="flex items-center border-b px-3 py-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.placeholder}
          className="border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          autoFocus
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="ml-2 hidden h-7 rounded border px-2 text-xs lg:block"
        >
          {t.esc}
        </Button>
      </div>
      <CommandList className="!h-[400px] !max-h-[400px]">
        {isLoading && displayResults.length === 0 && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">{t.searching}</span>
          </div>
        )}

        {!isLoading && displayResults.length === 0 && debouncedValue && (
          <CommandEmpty>{t.noResults}</CommandEmpty>
        )}

        {!debouncedValue && displayResults.length === 0 && !isLoading && (
          <CommandEmpty>{t.startTyping}</CommandEmpty>
        )}

        {displayResults.length > 0 && (
          <CommandGroup
            heading={
              !debouncedValue
                ? t.recentItems
                : cachedResults.length > 0 && results.length === 0
                  ? t.recentResults
                  : t.foundResults(displayResults.length)
            }
          >
            {displayResults.map((result) => (
              <CommandItem
                key={result.id}
                value={result.id}
                onSelect={() => handleSelect(result.url)}
                className="flex items-start gap-3"
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="truncate text-sm font-medium">{result.title}</div>
                  {result.description && (
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {result.description}
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground capitalize">{result.type}</span>
                    {result.categories && result.categories.length > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {result.categories.map((cat) => cat.title).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </>
  )
}

export function SearchButton({
  className = '',
  variant = 'ghost',
  publicContext,
}: {
  className?: string
  variant?: ButtonProps['variant']
  publicContext?: PublicContextProps
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const isMobile = useIsMobile(1024)
  const router = useRouter()

  const locale = (publicContext?.locale || localization.defaultLocale) as Locale
  const t = translations[locale] || translations[localization.defaultLocale as Locale]

  const debouncedValue = useDebounce(value, 300)
  const { results, cachedResults, initialResults, isLoading } = useSearch(debouncedValue, open)

  // Open/close the search UI, always resetting the query on close so it
  // clears no matter which path triggered the close (Esc, backdrop click,
  // result selection, or the shortcut below).
  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setValue('')
    }
  }, [])

  // Check for keyboard shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        handleOpenChange(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, handleOpenChange])

  // Handle selection of a result
  const handleSelect = (url: string) => {
    router.push(url)
    handleOpenChange(false)
  }

  // Combine cached and API results, showing cached first
  // Show initial results when no query, cached when available, or search results
  const displayResults = React.useMemo(() => {
    if (!debouncedValue) {
      return initialResults
    }
    if (cachedResults.length > 0 && results.length === 0 && !isLoading) {
      return cachedResults
    }
    return results
  }, [cachedResults, results, initialResults, isLoading, debouncedValue])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={`mx-2 px-3 text-muted-foreground transition-colors hover:text-foreground ${className}`}
        variant={variant}
      >
        <p className="flex items-center gap-2">
          <Search className="h-4 w-4 rotate-90" />
          <span className="hidden text-sm lg:block">{t.search}</span>
        </p>
      </Button>
      {isMobile ? (
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent
            side="bottom"
            className="flex h-[80vh] flex-col overflow-hidden p-0 [&>button]:hidden"
          >
            <VisuallyHidden>
              <SheetTitle>{t.search}</SheetTitle>
            </VisuallyHidden>
            <Command className="flex h-full flex-col overflow-hidden">
              <SearchList
                value={value}
                setValue={setValue}
                t={t}
                isLoading={isLoading}
                debouncedValue={debouncedValue}
                displayResults={displayResults}
                cachedResults={cachedResults}
                results={results}
                handleSelect={handleSelect}
                setOpen={setOpen}
              />
            </Command>
          </SheetContent>
        </Sheet>
      ) : (
        <CommandDialog open={open} onOpenChange={handleOpenChange}>
          <SearchList
            value={value}
            setValue={setValue}
            t={t}
            isLoading={isLoading}
            debouncedValue={debouncedValue}
            displayResults={displayResults}
            cachedResults={cachedResults}
            results={results}
            handleSelect={handleSelect}
            setOpen={setOpen}
          />
        </CommandDialog>
      )}
    </>
  )
}
