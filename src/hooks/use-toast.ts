'use client'

import type { ReactNode } from 'react'
import { toast as toastManager } from '@/components/ui/toast'

interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  variant?: 'default' | 'destructive'
}

function toast({ variant, ...options }: ToastOptions) {
  const id = toastManager.add({ ...options, type: variant === 'destructive' ? 'error' : 'info' })
  return {
    id,
    dismiss: () => toastManager.close(id),
    update: (next: ToastOptions) =>
      toastManager.update(id, {
        title: next.title,
        description: next.description,
        type: next.variant === 'destructive' ? 'error' : 'info',
      }),
  }
}

export { toast }
