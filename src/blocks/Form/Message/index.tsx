import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const Message: React.FC<{
  message: Record<string, any>
  publicContext: PublicContextProps
}> = ({ message, publicContext }) => {
  return (
    <Width className="my-12" width="100">
      {message && <RichText publicContext={publicContext} content={message} />}
    </Width>
  )
}
