import Link from 'next/link'
import { Fragment } from 'react'

import type { Credit } from '@/lib/site'

/**
 * A run of names (authors, recipients) in order. The Lab's own people, shown
 * on the site, link to their page and stand out; everyone else, Team Member or
 * Custom Author, is plain text.
 */
export function Credits({ people }: { people: Credit[] }) {
  return (
    <>
      {people.map((person, i) => (
        <Fragment key={person.key}>
          {i > 0 && ', '}
          {person.href ? (
            <Link
              href={person.href}
              className="relative z-10 text-foreground underline decoration-border underline-offset-4 hover:decoration-current"
            >
              {person.name}
            </Link>
          ) : (
            <span>{person.name}</span>
          )}
        </Fragment>
      ))}
    </>
  )
}
