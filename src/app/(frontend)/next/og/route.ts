/**
 * Route handler that gets the title as parameter and generates the OG Image
 */
import generateOGImage from '@/utilities/generateOGImage'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  /**
   * Get the title as parameter
   */
  const title = req.nextUrl.searchParams.get('title')
  const locale = req.nextUrl.searchParams.get('locale')

  return generateOGImage({ title, locale })
}
