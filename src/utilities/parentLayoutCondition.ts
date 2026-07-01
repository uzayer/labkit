import { Project } from '@/payload-types'

type LayoutBlock = NonNullable<Project['appendLayoutBlock']>[number]

/**
 * Finds the parent block of a nested array item inside a blocks field
 * (used by admin `condition` functions on fields nested in blocks).
 * Blocks now only live on Projects' `appendLayoutBlock` field.
 */
export const parentLayoutCondition = <T extends LayoutBlock>(
  data: Partial<Project>,
  childId: string,
  blockType: T['blockType'],
): T | null => {
  const blocks = (data.appendLayoutBlock ?? []) as LayoutBlock[]
  const res = blocks.find(
    (l): l is T =>
      l.blockType === blockType &&
      (l[blockType as keyof typeof l] as any)?.some((t: { id: string }) => t.id === childId),
  )
  return res || null
}
