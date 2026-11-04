import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/**
 * The contact form's validation, in its own module so zod loads only when
 * someone starts using the form (see `contact1.tsx`). Every page links to
 * /contact and Next prefetches that route's JavaScript, so zod in the page
 * chunk was downloaded on every visit to the site.
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  message: z.string().min(1, 'Message is required'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const contactFormResolver = zodResolver(contactFormSchema)
