'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Changelogblock } from '@/payload-types'
import {
  $convertFromMarkdownString,
  defaultEditorConfig,
  defaultEditorFeatures,
} from '@payloadcms/richtext-lexical'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import { getEnabledNodes, sanitizeServerEditorConfig } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'

export async function fetchGithubChangelogAction(pageId: string, blockId: string) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Find the changelog block
    const pages = await payload.find({
      collection: 'pages',
      where: {
        id: {
          equals: pageId,
        },
      },
      depth: 1,
      draft: true,
    })

    if (pages.docs.length === 0) {
      throw new Error('Changelog page not found')
    }

    const page = pages.docs[0]
    const block = page.layout.find((block) => block.id === blockId) as Changelogblock

    if (!block?.githubSettings?.repository) {
      throw new Error('GitHub repository not configured')
    }

    payload.logger.info(
      `Fetching release data from Github for repository ${block.githubSettings.repository}..`,
    )

    // Fetch releases from GitHub API
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }
    if (block.githubSettings.githubToken) {
      headers['Authorization'] = `Bearer ${block.githubSettings.githubToken}`
    }

    const response = await fetch(
      `https://api.github.com/repos/${block.githubSettings.repository}/releases`,
      { headers },
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const releases = await response.json()

    // Get existing GitHub IDs to avoid duplicates
    const existingEntries = block.entries || []
    const existingGithubIds = new Set(
      existingEntries.map((entry: any) => entry.githubId).filter(Boolean),
    )

    const editorConfig = defaultEditorConfig
    editorConfig.features = [...defaultEditorFeatures]

    const yourSanitizedEditorConfig = await sanitizeServerEditorConfig(
      editorConfig,
      await configPromise,
    )
    const headlessEditor = createHeadlessEditor({
      nodes: getEnabledNodes({
        editorConfig: yourSanitizedEditorConfig,
      }),
    })

    // Convert GitHub releases to changelog entries
    const newEntries = releases
      .filter((release: any) => !existingGithubIds.has(release.id.toString()))
      .map((release: any) => {
        // This very complex conversion here using the headless lexical editor is just to
        // convert markdown to JSON.. We might want to move that to a utility function at some point
        headlessEditor.update(
          () => {
            $convertFromMarkdownString(
              release.body,
              yourSanitizedEditorConfig.features.markdownTransformers,
              undefined,
              true,
            )
          },
          { discrete: true },
        )

        const editorJSON = headlessEditor.getEditorState().toJSON()

        return {
          title: release.name || `Release ${release.tag_name}`,
          version: release.tag_name.replace(/^v/, ''),
          date: release.published_at,
          description: editorJSON,
          githubId: release.id.toString(),
        }
      })

    if (newEntries.length > 0) {
      payload.logger.info(`Found ${newEntries.length} new releases to add`)

      // Update the block with new entries
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          layout: page.layout.map((layoutBlock) => {
            if (layoutBlock.id === blockId) {
              return {
                ...layoutBlock,
                entries: [...newEntries, ...existingEntries],
              }
            }
            return layoutBlock
          }),
        },
      })

      revalidatePath('/admin')
    } else {
      payload.logger.info('No new releases found')
      return { success: true, status: 'No new releases found' }
    }

    return { success: true }
  } catch (error) {
    console.error(`Error fetching GitHub changelog: ${error}`)
    throw error
  }
}
