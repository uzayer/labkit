/**
 * Utility to find the parent block's design version for a nested item
 * This helps with conditional field display when multiple blocks of the same type exist on a page
 */
export const findParentBlockVersion = (
  data: any,
  siblingData: any,
  options: {
    blockType?: string // The type of block to search for (e.g., 'feature', 'gallery')
    itemsField?: string // The field name in the block that contains the nested items (e.g., 'USPs')
    designVersionField?: string // The field name for the design version (default: 'designVersion')
  } = {},
): string => {
  // Set default options
  const { blockType, itemsField, designVersionField = 'designVersion' } = options

  if (!data?.layout || !Array.isArray(data.layout)) {
    return ''
  }

  // Get the item ID from siblingData if available
  const itemId = siblingData?.id
  if (!itemId) {
    return ''
  }

  // Try to infer the block type from context if not provided
  const inferredBlockType =
    blockType ||
    // Look for clues in the data structure
    data.blockType ||
    data.parentBlockType ||
    null

  // Build a list of blocks to search through
  let blocksToSearch = data.layout

  // If we know the block type, filter to just those blocks
  if (inferredBlockType) {
    blocksToSearch = blocksToSearch.filter((block: any) => block.blockType === inferredBlockType)
  }

  // For each block, search for our item
  for (const block of blocksToSearch) {
    // If itemsField is specified, check just that field
    if (itemsField && block[itemsField] && Array.isArray(block[itemsField])) {
      const foundItem = block[itemsField].find((item: any) => item.id === itemId)
      if (foundItem) {
        return block[designVersionField] || ''
      }
    } else {
      // Otherwise, check all array fields in the block
      for (const key in block) {
        if (Array.isArray(block[key])) {
          const foundItem = block[key].find((item: any) => item.id === itemId)
          if (foundItem) {
            return block[designVersionField] || ''
          }
        }
      }
    }
  }

  return ''
}

/**
 * Creates a condition function that checks if a nested item's parent block
 * has a design version that matches the specified criteria
 *
 * Supports both positive and negative matching:
 * - Positive: ['FEATURE1', 'FEATURE2'] - matches if version is in the list
 * - Negative: ['NOT FEATURE105'] - matches if version is NOT FEATURE105
 * - Mixed: ['FEATURE1', 'NOT FEATURE105'] - matches FEATURE1 but excludes FEATURE105
 *
 * This is the preferred way to create conditions for design version-based fields
 * in Payload CMS - it automatically determines which block type contains the item
 */
export const createBlockItemCondition = (
  supportedVersions: string[],
  options: {
    blockType?: string
    itemsField?: string
    designVersionField?: string
  } = {},
) => {
  return (data: any, siblingData: any) => {
    const designVersion = findParentBlockVersion(data, siblingData, options)

    // Process each version condition
    for (const condition of supportedVersions) {
      if (condition.startsWith('NOT ')) {
        // Negative condition - exclude this version
        const excludedVersion = condition.substring(4) // Remove 'NOT ' prefix
        if (designVersion === excludedVersion) {
          return false // Explicitly excluded
        }
      } else {
        // Positive condition - include this version
        if (designVersion === condition) {
          return true // Explicitly included
        }
      }
    }

    // If we have any positive conditions, default to false (not included)
    // If we only have negative conditions, default to true (not excluded)
    const hasPositiveConditions = supportedVersions.some((v) => !v.startsWith('NOT '))
    return !hasPositiveConditions
  }
}
