'use client'

import { useEffect } from 'react'

const r = 'radius'
// const colors = [
//     "background",
//     "foreground",
//     "card",
//     "card-foreground",
//     "popover",
//     "popover-foreground",
//     "primary",
//     "primary-foreground",
//     "secondary",
//     "secondary-foreground",
//     "muted",
//     "muted-foreground",
//     "accent",
//     "accent-foreground",
//     "destructive",
//     "destructive-foreground",
//     "border",
//     "input",
//     "ring-3",
//     "success",
//     "warning",
//     "error",
//     "chart-1",
//     "chart-2",
//     "chart-3",
//     "chart-4",
//     "chart-5",
//     "muted2",
//     "muted2-foreground",
// ]
const colors = ['bg-', 'text-', 'border-', 'ring-', 'shadow-']

const highlightColors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']
const highlightColorIndex = 0
let popover: HTMLDivElement | null = null
let prevHoveredElement: HTMLElement | null = null

// Function to place one element above another with pixel offset
function placeElementAbove(referenceElement, targetElement, offsetX = 0, offsetY = 0) {
  // Get the bounding box of the reference element
  const referenceRect = referenceElement.getBoundingClientRect()

  // Set initial styles to measure width
  targetElement.style.position = 'fixed'
  targetElement.style.visibility = 'hidden' // Hide temporarily to measure
  targetElement.style.backgroundColor = 'red'
  targetElement.style.color = 'white'
  targetElement.style.padding = '4px'
  targetElement.style.borderRadius = '10px'
  targetElement.style.lineHeight = '20px'
  targetElement.style.fontSize = '15px'
  targetElement.style.width = 'auto'

  // Measure the target element width
  const targetWidth = targetElement.offsetWidth

  // Calculate positions
  const topPosition = referenceRect.top - targetElement.offsetHeight + offsetY
  let leftPosition = referenceRect.left + offsetX

  // Check if element would go off screen to the left
  if (leftPosition + targetWidth > window.innerWidth) {
    leftPosition = window.innerWidth - targetWidth - 10 // 10px padding from right edge
  }

  // Ensure element doesn't go off screen to the left
  leftPosition = Math.max(10, leftPosition) // 10px minimum padding from left edge

  // Apply final position
  targetElement.style.top = `${topPosition}px`
  targetElement.style.left = `${leftPosition}px`
  targetElement.style.zIndex = 1000
  targetElement.style.visibility = 'visible' // Make visible again
}
function cssColorToHex(color) {
  // Create a temporary element to use browser's internal CSS parser
  const tempElement = document.createElement('div')
  tempElement.style.color = color
  document.body.appendChild(tempElement)

  // Get computed color in rgb(a) format
  const computedColor = window.getComputedStyle(tempElement).color
  document.body.removeChild(tempElement)

  // Match the rgba or rgb format
  const rgbaMatch = computedColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/)
  if (!rgbaMatch) {
    throw new Error('Invalid CSS color format')
  }

  // Extract red, green, blue, and alpha values
  const r = parseInt(rgbaMatch[1], 10)
  const g = parseInt(rgbaMatch[2], 10)
  const b = parseInt(rgbaMatch[3], 10)
  const a = rgbaMatch[4] !== undefined ? Math.round(parseFloat(rgbaMatch[4]) * 255) : null

  // Convert to hexadecimal
  const hexR = r.toString(16).padStart(2, '0')
  const hexG = g.toString(16).padStart(2, '0')
  const hexB = b.toString(16).padStart(2, '0')
  const hexA = a !== null ? a.toString(16).padStart(2, '0') : ''

  return `#${hexR}${hexG}${hexB}${hexA}`
}

export const ThemeColorHelper: React.FC<{}> = () => {
  // Mouseover Event listeners for popover
  useEffect(() => {
    // Event-Listener für das "mouseover"-Event
    const mouseover = (event: MouseEvent) => {
      // Gehovertes Element aus dem Event-Objekt
      const hoveredElement = event?.target as HTMLElement
      if (!hoveredElement || !hoveredElement?.className) return
      const highlightColor = 'red'
      // const highlightColor = highlightColors[highlightColorIndex];
      // highlightColorIndex = (highlightColorIndex + 1) % highlightColors.length;

      // Klassen des Elements als String abrufen
      let classNames: string[] = []
      try {
        classNames = hoveredElement?.className?.split(' ') || []
      } catch (error) {
        classNames = []
      }

      // Klassen in der Konsole ausgeben
      const c = classNames.filter((cn) =>
        colors.some((color) => {
          if (cn.match(/ring-offset/)) {
            return false
          }
          if (cn.match(/ring-[0-9]+/)) {
            return false
          }
          if (cn.match(/border-[0-9]+/)) {
            return false
          }
          if (cn.match(/shadow-[0-9]+/)) {
            return false
          }
          if (cn.match(/shadow-(lg|md|sm|xs|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/)) {
            return false
          }
          if (cn.match(/text-(lg|md|sm|xs|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/)) {
            return false
          }
          return cn.includes(color)
        }),
      )
      if (c.length > 0) {
        if (prevHoveredElement) {
          prevHoveredElement.style.outline = 'none'
        }
        if (popover) {
          popover.remove()
        }

        hoveredElement.style.outline = `2px solid ${highlightColor}`
        popover = document.createElement('div')
        popover.style.background = 'red'
        popover.style.color = 'black'
        popover.style.height = '20px'
        popover.style.lineHeight = '20px'
        popover.style.fontSize = '15px'
        popover.style.width = 'auto'
        popover.innerText = c.join(' ')
        document.body.appendChild(popover)
        placeElementAbove(hoveredElement, popover, -2, -8)
        prevHoveredElement = hoveredElement
        setTimeout(() => {
          hoveredElement.style.outline = 'none'
          if (popover) {
            popover.remove()
          }
        }, 10_000)
      }
    }
    document.addEventListener('mouseover', mouseover)
    return () => {
      document.removeEventListener('mouseover', mouseover)
    }
  }, [])

  // Theme Color Picker on right side of screen
  useEffect(() => {
    const colorPicker = document.createElement('div')
    colorPicker.style.position = 'fixed'
    colorPicker.style.fontSize = '12px'
    colorPicker.style.bottom = '10px'
    colorPicker.style.right = '10px'
    colorPicker.style.background = '#ddd'
    colorPicker.style.display = 'flex'
    colorPicker.style.flexDirection = 'column'
    colorPicker.style.zIndex = '100000'
    colorPicker.style.padding = '10px'
    // colorPicker.style.width = '200px'
    // colorPicker.style.height = '200px'
    // colorPicker.style.flexWrap = 'wrap'
    colorPicker.style.gap = '10px'
    const themeConfigElement = document.querySelector('#theme-config')
    if (!themeConfigElement) return
    const themeConfig = themeConfigElement?.innerHTML
      ?.split('\n')
      .filter((line) => line.startsWith('  --') && !line.includes('radius'))
      .map((line) => {
        let [name, value] = line.split(': ')
        name = name?.replace('--', '').trim()
        value = value?.replace(';', '').trim()
        return {
          name,
          value,
        }
      })
    themeConfig?.map(({ name, value }) => {
      const color = document.createElement('input')
      color.type = 'color'
      color.value = cssColorToHex(value)
      color.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement
        const newThemeConfig = themeConfigElement?.innerHTML?.replace(
          `${name}: ${value}`,
          `${name}: ${target?.value}`,
        )
        value = target?.value
        if (newThemeConfig) {
          themeConfigElement.innerHTML = newThemeConfig
        }
      })
      color.style.background = value
      color.style.width = '12px'
      color.style.height = '12px'
      color.style.padding = '0px'
      color.style.margin = '0px'
      color.style.border = '1px solid white'
      color.style.outline = 'none'
      color.style.borderRadius = '4px'
      colorPicker.appendChild(color)
      const label = document.createElement('div')
      label.innerText = name
      label.style.color = 'black'
      label.style.textAlign = 'left'
      label.style.margin = '-25px 0px 0px 24px'
      colorPicker.appendChild(label)

      const over = (event) => {
        color.style.border = '1px solid #f0f'
        label.style.color = '#f0f'
        const newThemeConfig = themeConfigElement?.innerHTML?.replace(
          `${name}: ${value}`,
          `${name}: #f0f`,
        )
        if (newThemeConfig) {
          themeConfigElement.innerHTML = newThemeConfig
        }
      }
      const out = (event) => {
        color.style.border = '1px solid white'
        label.style.color = 'black'
        const newThemeConfig = themeConfigElement?.innerHTML?.replace(
          `${name}: #f0f`,
          `${name}: ${value}`,
        )
        if (newThemeConfig) {
          themeConfigElement.innerHTML = newThemeConfig
        }
      }
      color.addEventListener('mouseover', over)
      color.addEventListener('mouseout', out)
      label.addEventListener('mouseover', over)
      label.addEventListener('mouseout', out)
    })
    document.body.prepend(colorPicker)

    const radiusSlider = document.createElement('input')
    radiusSlider.type = 'range'
    radiusSlider.min = '0'
    radiusSlider.step = '0.025'
    radiusSlider.max = '8'
    radiusSlider.style.marginBottom = '10px'
    let radiusValue = themeConfigElement?.innerHTML?.match(/--radius: ([0-9\.]*)rem/)?.[1]
    if (radiusValue) {
      radiusSlider.value = radiusValue
    }
    radiusSlider.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement
      const newThemeConfig = themeConfigElement?.innerHTML?.replace(
        `--radius: ${radiusValue}`,
        `--radius: ${target?.value}`,
      )
      if (newThemeConfig) {
        themeConfigElement.innerHTML = newThemeConfig
      }
      radiusValue = target?.value
    })
    const radiusLabel = document.createElement('div')
    radiusLabel.innerText = 'radius:'
    radiusLabel.style.marginBottom = '-4px'
    radiusLabel.style.color = 'black'
    radiusLabel.style.textAlign = 'left'
    colorPicker.prepend(radiusSlider)
    colorPicker.prepend(radiusLabel)

    const copy = document.createElement('button')
    copy.style.color = 'black'
    copy.style.backgroundColor = 'white'
    copy.style.border = '1px solid black'
    copy.style.borderRadius = '4px'
    copy.style.padding = '4px'
    copy.style.marginBottom = '10px'
    copy.innerText = 'Copy theme config to clipboard'
    copy.addEventListener('click', (event) => {
      const themeConfig = themeConfigElement?.innerHTML
      if (themeConfig) {
        navigator.clipboard.writeText(themeConfig)
      }
    })
    colorPicker.prepend(copy)

    return () => {
      colorPicker.remove()
    }
  }, [])

  return null
}
