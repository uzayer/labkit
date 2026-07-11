import React from 'react'
import { Media } from '@/components/Media'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { cn } from '@/utils'

type Props = MediaBlockProps & {
  disableContainer?: boolean
  captionClassName?: string
  enableGutter?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const { media, caption, aspectRatio, disableContainer, captionClassName, enableGutter } = props

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    '1/1': 'aspect-square',
    original: '',
  }

  return (
    <div className={!disableContainer ? 'container my-16' : ''}>
      <div className="mx-auto max-w-5xl">
        <div
          className={cn(
            'relative overflow-hidden rounded-lg',
            enableGutter ? 'p-4' : '',
            aspectRatio !== 'original' && aspectRatioClasses[aspectRatio || '16/9'],
          )}
        >
          <Media
            resource={media}
            className="h-full w-full"
            imgClassName="rounded-lg w-full h-full object-cover"
          />
        </div>
        {caption && (
          <p className={cn('mt-2 text-center text-sm text-muted-foreground', captionClassName)}>
            {caption}
          </p>
        )}
      </div>
    </div>
  )
}
