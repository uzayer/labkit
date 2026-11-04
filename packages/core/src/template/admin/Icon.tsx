'use client'

import { LucideProps } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic.js'

export type IconType = string

type IconProps = {
  icon: string
} & LucideProps

const normalizeIconName = (iconName: string): IconName => {
  const kebabName = iconName
    .replace(/([A-Z])/g, '-$1')
    .replace(/([0-9]+)x([0-9]+)/g, '$1-x-$2') // Handle 'x' between numbers
    .replace(/([0-9]+)/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/-+/g, '-')

  return kebabName as IconName
}

const renderDynamicIcon = (icon: string, props: LucideProps) => {
  return <DynamicIcon {...props} name={normalizeIconName(icon)} />
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
