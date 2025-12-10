'use client'

import React, { useState } from 'react'
import { Button, useWatchForm, toast, useDocumentInfo } from '@payloadcms/ui'
import './index.scss'
import { fetchGithubChangelogAction } from './actions'

type Props = {
  path: string
}

const FetchButton: React.FC<Props> = ({ path }) => {
  const [loading, setLoading] = useState(false)
  const { getDataByPath } = useWatchForm()
  const { id: pageId } = useDocumentInfo()

  // Get paths for data access
  const parentPath = path.split('.').slice(0, -1).join('.')
  const blockPath = parentPath.split('.').slice(0, -1).join('.')

  const githubSettings: {
    repository?: string
    githubToken?: string
  } = getDataByPath(parentPath)

  // Get the block id to hand it to the server action.
  const blockId = (getDataByPath(blockPath) as any)?.id

  const handleFetch = async () => {
    if (!githubSettings?.repository) {
      toast.error('Please configure a GitHub repository first')
      return
    }

    try {
      setLoading(true)

      if (!pageId || !blockId || typeof pageId !== 'string' || typeof blockId !== 'string') {
        throw new Error('Page or block not found')
      }

      // call the server action
      const { success, status } = await fetchGithubChangelogAction(pageId, blockId)

      if (status === 'No new releases found') {
        toast.info('No new releases found')
        return
      }
      toast.success('Fetched changelog successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch changelog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className="changelog-fetch__button"
      onClick={handleFetch}
      disabled={loading || !githubSettings?.repository}
      buttonStyle="secondary"
    >
      {loading ? 'Fetching...' : 'Fetch from GitHub'}
    </Button>
  )
}

export default FetchButton
