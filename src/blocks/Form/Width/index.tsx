import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  return (
    <div
      className={className}
      style={{
        flex:
          width && typeof width === 'number' && width < 100
            ? `1 1 calc(${width}% - 20px)`
            : '1 1 100%',
      }}
    >
      {children}
    </div>
  )
}
