/**
 * Clipboard for the Cite surfaces. The citations themselves are generated on
 * the server from the record (`@/lib/dial/cite`), never written by hand.
 */

export async function copyToClipboard(text: string) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
    window.prompt('Copy this citation text:', text)
  } catch {
    // silent
  }
}
