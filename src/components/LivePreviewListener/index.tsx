'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import { useRouter } from 'next/navigation'
import React from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={NEXT_PUBLIC_SERVER_URL!} />
}
