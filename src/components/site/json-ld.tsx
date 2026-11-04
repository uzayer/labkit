import { serializeJsonLd, type JsonLd as JsonLdData } from '@labkit/core/seo'

/** schema.org JSON-LD for the page, from `@labkit/core/seo`'s builders. */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
