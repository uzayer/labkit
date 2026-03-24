/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is Record<string | number | symbol, unknown> {
  return !!item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export default function deepMerge<
  T extends Record<string | number | symbol, unknown>,
  R extends Record<string | number | symbol, unknown>,
>(target: T, source: R): T & R {
  const output: Record<string | number | symbol, unknown> = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const typedKey = key as keyof typeof source
      const sourceValue = source[typedKey]

      if (isObject(sourceValue)) {
        if (!(typedKey in target)) {
          output[typedKey] = sourceValue
        } else {
          const targetValue = target[typedKey]
          output[typedKey] = isObject(targetValue)
            ? deepMerge(targetValue, sourceValue)
            : sourceValue
        }
      } else {
        output[typedKey] = sourceValue
      }
    })
  }

  return output as T & R
}
