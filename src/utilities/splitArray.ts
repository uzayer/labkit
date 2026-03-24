/**
 * Splits an array into two halves.
 * @param arr - The array to split.
 * @returns An array of two halves.
 */
export const splitArray = <T>(arr: T[]): [T[], T[]] => {
  const mid = Math.floor(arr.length / 2)
  // If the length is even, each half is equal.
  // If the length is odd, the second half will have one extra element.
  return [arr.slice(0, mid), arr.slice(mid)]
}
