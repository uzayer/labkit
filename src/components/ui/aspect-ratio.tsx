import * as React from 'react'

interface AspectRatioProps extends React.ComponentProps<'div'> {
  ratio: number
}

function AspectRatio({ ratio, style, ...props }: AspectRatioProps) {
  return <div style={{ aspectRatio: ratio, ...style }} {...props} />
}

export { AspectRatio }
