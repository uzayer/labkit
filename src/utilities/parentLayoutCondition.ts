import { Page } from '@/payload-types'

export const parentLayoutCondition = <T extends Page['layout'][number]>(
  data: Page,
  childId: string,
  blockType: T['blockType'],
): T | null => {
  const res = data.layout.find(
    (l): l is T =>
      l.blockType === blockType &&
      (l[blockType as keyof typeof l] as any)?.some((t: { id: string }) => t.id === childId),
  )
  return res || null
}
