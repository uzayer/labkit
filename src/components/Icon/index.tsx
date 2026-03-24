'use client'

import dynamic from 'next/dynamic'
import { LucideProps } from 'lucide-react'

export type IconType = string

type IconProps = {
  icon: string
} & LucideProps

// Cache for dynamic components
const iconComponentCache = new Map<string, any>()

const createDynamicIcon = (iconName: string) => {
  if (iconComponentCache.has(iconName)) {
    return iconComponentCache.get(iconName)
  }

  const kebabName = iconName
    .replace(/([A-Z])/g, '-$1')
    .replace(/([0-9]+)x([0-9]+)/g, '$1-x-$2') // Handle 'x' between numbers
    .replace(/([0-9]+)/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/-+/g, '-')

  const DynamicIcon = dynamic(() => import(`lucide-react/dist/esm/icons/${kebabName}.js`), {
    loading: () => (
      <div
        style={{
          width: 24,
          height: 24,
          display: 'inline-block',
        }}
      />
    ),
    ssr: false,
  })

  iconComponentCache.set(iconName, DynamicIcon)
  return DynamicIcon
}

const renderDynamicIcon = (icon: string, props: LucideProps) => {
  const DynamicIcon = createDynamicIcon(icon)
  return <DynamicIcon {...props} />
}

export const Icon: React.FC<IconProps> = ({ icon, size = 24, ...props }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {renderDynamicIcon(icon, { size, ...props })}
    </div>
  )
}
