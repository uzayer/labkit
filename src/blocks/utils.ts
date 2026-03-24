import type { Field } from 'payload'
import type { DesignVersionPreviewOptions } from '@/components/AdminDashboard/DesignVersionPreview/config'

export type VariantManifest = Record<
  string,
  { label: string; previewImage?: string; fields: string[] }
>

/**
 * Converts a variant manifest to the options array expected by designVersionPreview().
 * Use this in config.ts: designVersionPreview(variantsToOptions(variants))
 */
export function variantsToOptions(variants: VariantManifest): DesignVersionPreviewOptions {
  return Object.entries(variants).map(([value, { label, previewImage }]) => ({
    label,
    value,
    image: previewImage,
  }))
}

/**
 * Applies admin.condition to each field based on which variants list it.
 *
 * Fields listed in at least one variant's fields[] get a condition that shows them
 * only when the current designVersion is one that includes the field.
 *
 * Fields not listed in any variant's fields[] are pass-through — they keep whatever
 * condition (or lack thereof) they already have.
 *
 * Edge cases (nested array conditions, compound conditions) should be handled explicitly
 * in config.ts rather than passed through this utility.
 */
export function applyVariantConditions(variants: VariantManifest, fieldDefs: Field[]): Field[] {
  // Build inverse map: fieldName → variant keys that include it
  const fieldToVariants: Record<string, string[]> = {}
  for (const [variantKey, { fields }] of Object.entries(variants)) {
    for (const fieldName of fields) {
      if (!fieldToVariants[fieldName]) fieldToVariants[fieldName] = []
      fieldToVariants[fieldName].push(variantKey)
    }
  }

  return fieldDefs.map((field) => {
    const fieldName = 'name' in field ? (field.name as string) : undefined
    if (!fieldName || !fieldToVariants[fieldName]) return field // pass-through

    const allowedVersions = fieldToVariants[fieldName]
    return {
      ...field,
      admin: {
        ...(field as any).admin,
        condition: (_: any, { designVersion = '' }: any = {}) =>
          allowedVersions.includes(designVersion),
      },
    }
  })
}
