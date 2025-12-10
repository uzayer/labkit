'use client'

import type { PayloadAdminBarProps } from '@payloadcms/admin-bar'

import { cn } from '@/utilities/cn'
import { useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import './index.scss'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import { ThemeColorHelper } from './ThemeColorHelper'

const baseClass = 'admin-bar'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const collection = collectionLabels?.[segments?.[1]] ? segments?.[1] : 'pages'
  const router = useRouter()

  const onAuthChange = React.useCallback((user) => {
    setShow(user?.id)
  }, [])

  // Theme Color Picker on right side of screen
  const [showThemeColorPicker, setShowThemeColorPicker] = useState(false)

  return (
    <div
      className={cn(baseClass, 'bg-black py-2 text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <div className="flex items-center gap-4" style={{ fontSize: 'small' }}>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showThemeColorPicker}
              onChange={(e) => setShowThemeColorPicker(e.target.checked)}
              className="h-3 w-3"
            />
            <span>Theme Editor</span>
          </label>
          {showThemeColorPicker && <ThemeColorHelper />}
        </div>
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={NEXT_PUBLIC_SERVER_URL}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/')
              router.refresh()
            })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
