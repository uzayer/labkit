import { FaqBlock } from '@/payload-types'

type Props = {
  faqs: FaqBlock['faqs']
}

const stripHtml = (html: any): string => {
  // Simple function to strip HTML and get plain text from Lexical editor content
  if (!html || !html.root || !html.root.children) return ''

  return html.root.children
    .map((child: any) => {
      if (child.type === 'text') return child.text || ''
      if (child.children) return stripHtml({ root: { children: child.children } })
      return ''
    })
    .join(' ')
    .trim()
}

const FaqStructuredData: React.FC<Props> = ({ faqs }) => {
  if (!faqs?.length) return null

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(answer),
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
    />
  )
}

export default FaqStructuredData
