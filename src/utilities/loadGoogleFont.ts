export async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@600&text=${encodeURIComponent(
    text,
  )}&display=swap`

  const css = await (
    await fetch(url, {
      headers: {
        // Use older Firefox UA to get TTF instead of WOFF2
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:27.0) Gecko/20100101 Firefox/27.0',
      },
    })
  ).text()

  // Match any font URL, regardless of format
  const fontUrl = css.match(/src: url\((.+?)\)/)?.[1]

  if (!fontUrl) {
    throw new Error(`Failed to extract font URL from CSS: ${css}`)
  }

  const res = await fetch(fontUrl)
  if (res.status !== 200) {
    throw new Error(`Failed to load font from URL: ${fontUrl}`)
  }

  return res.arrayBuffer()
}
