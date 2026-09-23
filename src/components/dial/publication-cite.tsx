'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { SegmentedControl } from '@/components/dial/segmented-control'
import { copyToClipboard } from '@/lib/dial/citation'
import { cn } from '@/lib/utils'

type Format = 'apa' | 'bibtex'

/**
 * The citation, set as a block of type rather than hidden behind a dialog.
 *
 * On a list a dialog is right — twenty rows cannot each carry a paragraph of
 * monospace. On the paper's own page the citation is one of the two things a
 * reader actually came for (the other is the PDF), so it is printed, at size,
 * on the page: a ruled slug of text with the plate caption a press would set
 * beside it.
 */
export function CitationPanel({
  apa,
  bibtex,
  className,
}: {
  apa?: string | null
  bibtex: string
  className?: string
}) {
  const [format, setFormat] = useState<Format>(apa ? 'apa' : 'bibtex')
  const [copied, setCopied] = useState(false)

  const text = format === 'apa' ? (apa ?? '') : bibtex

  async function handleCopy() {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {apa ? (
          <SegmentedControl<Format>
            label="Citation format"
            options={[
              { value: 'apa' as Format, label: 'APA' },
              { value: 'bibtex' as Format, label: 'BibTeX' },
            ]}
            value={format}
            onChange={setFormat}
          />
        ) : (
          <span className="text-ink font-mono text-[10px] tracking-[0.2em] uppercase">BibTeX</span>
        )}

        {/* Both labels stay mounted and crossfade, with a 2px blur on the one
            leaving, so the swap reads as one change rather than two words
            trading places. */}
        <button
          type="button"
          onClick={handleCopy}
          className="ease-snappy hover:border-ink inline-flex items-center rounded-full border border-border px-3.5 py-1.5 text-sm transition-[transform,border-color] duration-150 active:scale-[0.97]"
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

      <div className="border-ink/35 relative mt-4 border">
        <span aria-hidden className="ink-mark halftone absolute inset-0 opacity-[0.07]" />
        <pre
          className={cn(
            'relative overflow-x-auto p-4 text-sm leading-relaxed whitespace-pre-wrap',
            format === 'bibtex' ? 'font-mono text-xs md:text-sm' : 'font-sans',
          )}
        >
          {text}
        </pre>
      </div>
    </div>
  )
}
