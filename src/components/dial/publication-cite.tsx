'use client'

import { type ReactElement, useState, useSyncExternalStore } from 'react'
import { Check, Copy, Quote } from 'lucide-react'

import { SegmentedControl } from '@/components/dial/segmented-control'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/dial/ui/popover'
import { copyToClipboard } from '@/lib/dial/citation'
import type { CitationStyle, Citations } from '@/lib/dial/cite'
import { cn } from '@/lib/utils'

const STYLES: { value: CitationStyle; label: string }[] = [
  { value: 'acm', label: 'ACM' },
  { value: 'apa', label: 'APA' },
  { value: 'bibtex', label: 'BibTeX' },
]

// A reader who wants BibTeX wants it on every paper: the last style picked is
// shared by every panel on the page and, where storage allows, kept across
// visits. The server snapshot is ACM, so hydration always agrees.
const STYLE_KEY = 'dial:citation-style'
let pickedStyle: CitationStyle | null = null
const styleListeners = new Set<() => void>()

function readStyle(): CitationStyle {
  if (pickedStyle) return pickedStyle
  try {
    const stored = window.localStorage.getItem(STYLE_KEY)
    if (STYLES.some((s) => s.value === stored)) return stored as CitationStyle
  } catch {
    // Storage blocked: ACM, the default.
  }
  return 'acm'
}

function pickStyle(style: CitationStyle) {
  pickedStyle = style
  try {
    window.localStorage.setItem(STYLE_KEY, style)
  } catch {
    // Kept for this page only.
  }
  styleListeners.forEach((listener) => listener())
}

function subscribeStyle(listener: () => void) {
  styleListeners.add(listener)
  return () => styleListeners.delete(listener)
}

/**
 * The citation, set as a block of type: ACM, APA, or BibTeX, all generated
 * from the record on the server (`@/lib/dial/cite`), and one Copy.
 *
 * On the paper's own page it is printed at size, since the citation is one of
 * the two things a reader came for. In a list it lives in the Cite popover,
 * `compact`, because twenty rows cannot each carry a paragraph of monospace.
 */
export function CitationPanel({
  citations,
  compact = false,
  className,
}: {
  /** Undefined while a popover is still fetching them. */
  citations?: Citations | null
  compact?: boolean
  className?: string
}) {
  const style = useSyncExternalStore(subscribeStyle, readStyle, () => 'acm' as const)
  const [copied, setCopied] = useState(false)

  const text = citations?.[style] ?? ''

  function choose(next: CitationStyle) {
    pickStyle(next)
    setCopied(false)
  }

  async function handleCopy() {
    if (!text) return
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl<CitationStyle>
          label="Citation style"
          options={STYLES}
          value={style}
          onChange={choose}
          size={compact ? 'sm' : 'md'}
        />

        {/* Both labels stay mounted and crossfade, with a 2px blur on the one
            leaving, so the swap reads as one change rather than two words
            trading places. */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={!text}
          className="ease-snappy hover:border-ink inline-flex items-center rounded-full border border-border px-3.5 py-1.5 text-sm transition-[transform,border-color] duration-150 active:scale-[0.97] disabled:opacity-50"
        >
          <span className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
            <span
              aria-hidden={copied}
              className={cn(
                'ease-snappy inline-flex items-center gap-2 transition-[opacity,filter] duration-150',
                copied ? 'opacity-0 blur-[2px]' : 'opacity-100',
              )}
            >
              <Copy className="size-3.5" />
              Copy
            </span>
            <span
              aria-hidden={!copied}
              className={cn(
                'ease-snappy inline-flex items-center gap-2 transition-[opacity,filter] duration-150',
                copied ? 'opacity-100' : 'opacity-0 blur-[2px]',
              )}
            >
              <Check
                className={cn(
                  'text-ink ease-snappy size-3.5 transition-transform duration-200',
                  copied ? 'scale-100' : 'scale-80',
                )}
              />
              Copied
            </span>
          </span>
        </button>
      </div>

      {/* The visible label swaps silently; a screen reader hears this. */}
      <span aria-live="polite" className="sr-only">
        {copied ? `${STYLES.find((s) => s.value === style)?.label} citation copied` : ''}
      </span>

      <div className={cn('border-ink/35 relative border', compact ? 'mt-3' : 'mt-4')}>
        <span aria-hidden className="ink-mark halftone absolute inset-0 opacity-[0.07]" />
        {citations === null ? (
          <p className="relative p-4 text-sm text-muted-foreground">
            The citation could not be loaded. The DOI link has the publisher&rsquo;s version.
          </p>
        ) : citations === undefined ? (
          // Three ruled lines the height of a reference, so the popover does
          // not jump when the text arrives.
          <div aria-busy className="relative flex flex-col gap-2.5 p-4">
            <span className="h-3 w-full animate-pulse rounded-sm bg-muted" />
            <span className="h-3 w-11/12 animate-pulse rounded-sm bg-muted" />
            <span className="h-3 w-2/3 animate-pulse rounded-sm bg-muted" />
          </div>
        ) : (
          <pre
            className={cn(
              'relative overflow-x-auto p-4 leading-relaxed whitespace-pre-wrap',
              style === 'bibtex'
                ? 'font-mono text-xs [tab-size:2]'
                : cn('font-sans', compact ? 'text-sm' : 'text-sm md:text-base'),
              compact && 'max-h-72 overflow-y-auto',
            )}
          >
            {text}
          </pre>
        )}
      </div>
    </div>
  )
}

// One fetch per paper per page load, however often its popover opens.
const requests = new Map<string, Promise<Citations | null>>()

function fetchCitations(id: string): Promise<Citations | null> {
  let request = requests.get(id)
  if (!request) {
    request = fetch(`/publications/${encodeURIComponent(id)}/cite`)
      .then((res) => (res.ok ? (res.json() as Promise<Citations>) : null))
      .catch(() => null)
      .then((result) => {
        // A failure is not cached: the next open tries again.
        if (!result) requests.delete(id)
        return result
      })
    requests.set(id, request)
  }
  return request
}

/**
 * A list row's Cite: the one action that stays on the page. It sits last on
 * the row's links line, after DOI, with no outbound arrow, because it does not
 * leave. It opens a popover anchored to itself, since citing is a quick copy,
 * not a trip. The citations are fetched on open, not shipped with the list.
 */
export function CiteButton({
  id,
  render,
  className,
}: {
  id: string
  /** A different trigger element, for a list whose actions are buttons. */
  render?: ReactElement
  className?: string
}) {
  const [citations, setCitations] = useState<Citations | null | undefined>(undefined)

  function handleOpenChange(open: boolean) {
    if (!open || citations) return
    setCitations(undefined)
    void fetchCitations(id).then(setCitations)
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger
        // Warm the request on intent, so the text is usually there on open.
        onPointerEnter={() => void fetchCitations(id)}
        onFocus={() => void fetchCitations(id)}
        render={render}
        className={cn(!render && 'cite-trigger', className)}
      >
        <Quote className={cn(!render && 'size-3.5 text-muted-foreground')} aria-hidden />
        Cite
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[calc(100vw-2rem)] max-w-md p-4 duration-150"
      >
        <CitationPanel citations={citations} compact />
      </PopoverContent>
    </Popover>
  )
}
