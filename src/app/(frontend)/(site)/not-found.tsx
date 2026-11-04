import { PrimaryLink } from '@/components/site/links'
import { pageTitle, lede, label } from '@/lib/site/typography'
import { cn } from '@/utils'

export default function NotFound() {
  return (
    <section className="container pt-16 pb-24 md:pt-28">
      <p className={label}>404</p>
      <h1 className={cn(pageTitle, 'mt-4')}>Page not found</h1>
      <p className={cn(lede, 'mt-8 border-t border-border pt-6')}>
        This page doesn&apos;t exist, or it has moved.
      </p>
      <PrimaryLink href="/" className="mt-8">
        Go to the home page
      </PrimaryLink>
    </section>
  )
}
