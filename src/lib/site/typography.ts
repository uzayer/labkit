// The site's type scale, shared so every page reads as one site. Titles are set
// in the display serif; everything else stays in the sans.
export const pageTitle =
  'font-display text-5xl leading-[0.95] font-normal tracking-tight text-balance md:text-7xl'
export const sectionTitle =
  'font-display text-3xl leading-tight font-normal tracking-tight text-balance md:text-4xl'
export const lede = 'max-w-prose text-lg text-pretty text-muted-foreground'
/** Small uppercase label above a title or a column of metadata. */
export const label = 'text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase'
/** The one section rhythm. The first section under a page header adds `pt-0 md:pt-0`. */
export const sectionSpacing = 'py-12 md:py-16'
/** A link inside running text. */
export const inlineLink =
  'underline decoration-border underline-offset-4 transition-colors hover:decoration-current'
