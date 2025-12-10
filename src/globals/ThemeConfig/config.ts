import type { GlobalConfig, TextFieldSingleValidation } from 'payload'

import { revalidateThemeConfig } from './hooks/revalidateThemeConfig'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import { isAdminFieldLevel } from '@/access/isAdmin'

const validateCssColor: TextFieldSingleValidation = (value: string) => {
  const cssColorRegex =
    /^#(?:[\da-f]{3}){1,2}$|^#(?:[\da-f]{4}){1,2}$|(rgb|hsl)a?\((\s*-?\d+(?:\.\d+)?%?\s*,){2}(\s*-?\d+(?:\.\d+)?%?\s*)\)|(rgb|hsl)a?\((\s*-?\d+(?:\.\d+)?%?\s*,){3}\s*(0|(0?\.\d+)|1)\)/gim
  if (!cssColorRegex.test(value)) {
    return 'Please enter a valid css color (e.g. #FF0000, #F00, rgb(255, 0, 0), hsl(0, 100%, 50%), rgba(255, 0, 0, 0.5), hsla(0, 100%, 50%, 0.5))'
  }
  return true
}

const validateCssSize: TextFieldSingleValidation = (value: string) => {
  const cssSizeRegex = /^(-?\d*\.?\d+)(px|em|rem|%|vh|vw|vmin|vmax|pt|pc|in|cm|mm|ex|ch)$/i
  if (!cssSizeRegex.test(value)) {
    return 'Please enter a valid CSS size (e.g. 10px, 1.5rem, 50%, 100vh)'
  }
  return true
}

export const ThemeConfig: GlobalConfig = {
  slug: 'themeConfig',
  access: {
    read: () => true,
    update: isAdminFieldLevel,
  },
  admin: {
    description: 'Theme configuration (For live preview config has to be saved)',
    livePreview: {
      url: () => {
        const path = generatePreviewPath({
          slug: 'home',
          breadcrumbs: undefined,
          collection: 'pages',
          locale: 'en',
        })

        return `${NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: () => {
      const path = generatePreviewPath({
        slug: 'home',
        breadcrumbs: undefined,
        collection: 'pages',
        locale: 'en',
      })

      return `${NEXT_PUBLIC_SERVER_URL}${path}`
    },
  },
  fields: [
    {
      name: 'radius',
      type: 'text',
      validate: validateCssSize,
      defaultValue: '0.6rem',
    },
    {
      name: 'regularColors',
      label: 'Regular Colors',
      type: 'group',
      fields: [
        {
          name: 'background',
          label: {
            en: 'Background Color',
            de: 'Hintergrundfarbe',
          },
          admin: {
            description: {
              en: 'The main background color of the website. Used for the overall page background and provides the base canvas for all content.',
              de: 'Die Haupthintergrundfarbe der Website. Wird für den gesamten Seitenhintergrund verwendet und bildet die Grundlage für alle Inhalte.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(0, 0%, 100%)',
        },
        {
          name: 'foreground',
          label: {
            en: 'Text Color',
            de: 'Textfarbe',
          },
          admin: {
            description: {
              en: 'The primary text color used throughout the website. Provides optimal contrast against the background for readability.',
              de: 'Die primäre Textfarbe, die auf der gesamten Website verwendet wird. Bietet optimalen Kontrast zum Hintergrund für beste Lesbarkeit.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2, 84%, 4.9%)',
        },
        {
          name: 'card',
          label: {
            en: 'Card Background',
            de: 'Karten-Hintergrund',
          },
          admin: {
            description: {
              en: 'Background color for card components. Used for elevated surfaces that contain grouped content.',
              de: 'Hintergrundfarbe für Kartenkomponenten. Wird für erhöhte Oberflächen verwendet, die gruppierten Inhalt enthalten.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(240, 5%, 96%)',
        },
        {
          name: 'card-foreground',
          label: {
            en: 'Card Text Color',
            de: 'Karten-Textfarbe',
          },
          admin: {
            description: {
              en: 'Text color used within card components. Ensures readable content against the card background.',
              de: 'Textfarbe innerhalb von Kartenkomponenten. Gewährleistet lesbare Inhalte auf dem Kartenhintergrund.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2, 84%, 4.9%)',
        },
        {
          name: 'popover',
          label: {
            en: 'Popover Background',
            de: 'Popover-Hintergrund',
          },
          admin: {
            description: {
              en: 'Background color for floating elements like dropdowns, tooltips, and popovers.',
              de: 'Hintergrundfarbe für schwebende Elemente wie Dropdown-Menüs, Tooltips und Popovers.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(0, 0%, 100%)',
        },
        {
          name: 'popover-foreground',
          label: {
            en: 'Popover Text Color',
            de: 'Popover-Textfarbe',
          },
          admin: {
            description: {
              en: 'Text color used within popover elements. Ensures content is readable against the popover background.',
              de: 'Textfarbe in Popover-Elementen. Stellt sicher, dass der Inhalt auf dem Popover-Hintergrund lesbar ist.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2, 84%, 4.9%)',
        },
        {
          name: 'primary',
          label: {
            en: 'Primary Color',
            de: 'Primärfarbe',
          },
          admin: {
            description: {
              en: 'Main brand color used for important interactive elements like primary buttons, links, and key UI components. This color should reflect your brand identity.',
              de: 'Hauptmarkenfarbe für wichtige interaktive Elemente wie primäre Schaltflächen, Links und zentrale UI-Komponenten. Diese Farbe sollte Ihre Markenidentität widerspiegeln.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2, 47.4%, 11.2%)',
        },
        {
          name: 'primary-foreground',
          label: {
            en: 'Primary Text Color',
            de: 'Primäre Textfarbe',
          },
          admin: {
            description: {
              en: 'Text color used on primary backgrounds. Ensures optimal contrast and readability for emphasized content.',
              de: 'Textfarbe auf primären Hintergründen. Gewährleistet optimalen Kontrast und Lesbarkeit für hervorgehobene Inhalte.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
        },
        {
          name: 'secondary',
          label: {
            en: 'Secondary Color',
            de: 'Sekundärfarbe',
          },
          admin: {
            description: {
              en: 'Used for secondary UI elements and alternative actions. Provides visual hierarchy and contrast to primary elements.',
              de: 'Verwendet für sekundäre UI-Elemente und alternative Aktionen. Bietet visuelle Hierarchie und Kontrast zu primären Elementen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 96.1%)',
        },
        {
          name: 'secondary-foreground',
          label: {
            en: 'Secondary Text Color',
            de: 'Sekundäre Textfarbe',
          },
          admin: {
            description: {
              en: 'Text color for secondary UI elements. Ensures readability while maintaining visual distinction from primary text.',
              de: 'Textfarbe für sekundäre UI-Elemente. Gewährleistet Lesbarkeit bei gleichzeitiger visueller Unterscheidung vom primären Text.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2, 47.4%, 11.2%)',
        },
        {
          name: 'muted',
          label: {
            en: 'Muted Background',
            de: 'Gedämpfter Hintergrund',
          },
          admin: {
            description: {
              en: 'Used for subtle background variations and disabled states. Creates visual depth without drawing attention.',
              de: 'Verwendet für subtile Hintergrundvariationen und deaktivierte Zustände. Erzeugt visuelle Tiefe ohne Aufmerksamkeit zu erregen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 96.1%)',
        },
        {
          name: 'muted-foreground',
          label: {
            en: 'Muted Text Color',
            de: 'Gedämpfte Textfarbe',
          },
          admin: {
            description: {
              en: 'Used for less prominent text like placeholders and disabled content. Provides subtle contrast against the background.',
              de: 'Verwendet für weniger prominenten Text wie Platzhalter und deaktivierte Inhalte. Bietet subtilen Kontrast zum Hintergrund.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(215.4, 16.3%, 46.9%)',
        },
        {
          name: 'accent',
          label: {
            en: 'Accent Color',
            de: 'Akzentfarbe',
          },
          admin: {
            description: {
              en: 'Used for highlighting and emphasizing specific UI elements. Adds visual interest and draws attention to important features.',
              de: 'Verwendet für die Hervorhebung bestimmter UI-Elemente. Fügt visuelles Interesse hinzu und lenkt die Aufmerksamkeit auf wichtige Funktionen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 96.1%)',
        },
        {
          name: 'accent-foreground',
          label: {
            en: 'Accent Text Color',
            de: 'Akzent-Textfarbe',
          },
          admin: {
            description: {
              en: 'Text color used on accent backgrounds. Ensures optimal contrast and readability for emphasized content.',
              de: 'Textfarbe auf Akzenthintergründen. Gewährleistet optimalen Kontrast und Lesbarkeit für hervorgehobene Inhalte.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2, 47.4%, 11.2%)',
        },
        {
          name: 'destructive',
          label: {
            en: 'Destructive Color',
            de: 'Destruktive Farbe',
          },
          admin: {
            description: {
              en: 'Used for destructive actions like deleting or removing content. Provides clear visual indication of potential negative consequences.',
              de: 'Verwendet für destruktive Aktionen wie das Löschen oder Entfernen von Inhalten. Bietet klare visuelle Anzeige möglicher negativer Konsequenzen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(0, 84.2%, 60.2%)',
        },
        {
          name: 'destructive-foreground',
          label: {
            en: 'Destructive Text Color',
            de: 'Destruktive Textfarbe',
          },
          admin: {
            description: {
              en: 'Text color used on destructive backgrounds. Ensures optimal contrast and readability for emphasized content.',
              de: 'Textfarbe auf destruktiven Hintergründen. Gewährleistet optimalen Kontrast und Lesbarkeit für hervorgehobene Inhalte.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
        },
        {
          name: 'border',
          label: {
            en: 'Border Color',
            de: 'Rahmenfarbe',
          },
          admin: {
            description: {
              en: 'Used for borders and outlines of UI elements. Provides visual separation and definition.',
              de: 'Verwendet für Ränder und Umrandungen von UI-Elementen. Bietet visuelle Trennung und Definition.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(240, 6%, 90%)',
        },
        {
          name: 'input',
          label: {
            en: 'Input Background',
            de: 'Eingabehintergrund',
          },
          admin: {
            description: {
              en: 'Background color for input fields and text areas. Provides a clear and readable surface for user input.',
              de: 'Hintergrundfarbe für Eingabefelder und Textbereiche. Bietet eine klare und lesbare Oberfläche für Benutzereingaben.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(214.3, 31.8%, 91.4%)',
        },
        {
          name: 'ring-3',
          label: {
            en: 'Ring Color',
            de: 'Ringfarbe',
          },
          admin: {
            description: {
              en: 'Used for ring-3 or glow effects around interactive elements. Provides visual feedback and emphasis.',
              de: 'Verwendet für Ring- oder Glowe-Effekte um interaktive Elemente. Bietet visuelles Feedback und Betonung.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2, 84%, 4.9%)',
        },
        {
          name: 'success',
          label: {
            en: 'Success Color',
            de: 'Erfolgfarbe',
          },
          admin: {
            description: {
              en: 'Used for success messages and positive feedback. Provides a clear visual indication of successful actions.',
              de: 'Verwendet für Erfolgsmeldungen und positives Feedback. Bietet eine klare visuelle Anzeige erfolgreicher Aktionen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(196, 52%, 74%)',
        },
        {
          name: 'warning',
          label: {
            en: 'Warning Color',
            de: 'Warnfarbe',
          },
          admin: {
            description: {
              en: 'Used for warning messages and cautionary feedback. Provides a clear visual indication of potential issues.',
              de: 'Verwendet für Warnmeldungen und vorsichtiges Feedback. Bietet eine klare visuelle Anzeige möglicher Probleme.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(34, 89%, 85%)',
        },
        {
          name: 'error',
          label: {
            en: 'Error Color',
            de: 'Fehlerfarbe',
          },
          admin: {
            description: {
              en: 'Used for error messages and critical feedback. Provides a clear visual indication of errors or problems.',
              de: 'Verwendet für Fehlermeldungen und kritische Feedback. Bietet eine klare visuelle Anzeige von Fehlern oder Problemen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(10, 100%, 86%)',
        },
        {
          name: 'chart-1',
          label: {
            en: 'Chart Color 1',
            de: 'Diagrammfarbe 1',
          },
          admin: {
            description: {
              en: 'Used for the first series of data in charts and graphs. Provides visual distinction and clarity.',
              de: 'Verwendet für die erste Reihe von Daten in Diagrammen und Grafiken. Bietet visuelle Unterscheidung und Klarheit.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(12, 76%, 61%)',
        },
        {
          name: 'chart-2',
          label: {
            en: 'Chart Color 2',
            de: 'Diagrammfarbe 2',
          },
          admin: {
            description: {
              en: 'Used for the second series of data in charts and graphs. Provides visual distinction and clarity.',
              de: 'Verwendet für die zweite Reihe von Daten in Diagrammen und Grafiken. Bietet visuelle Unterscheidung und Klarheit.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(173, 58%, 39%)',
        },
        {
          name: 'chart-3',
          label: {
            en: 'Chart Color 3',
            de: 'Diagrammfarbe 3',
          },
          admin: {
            description: {
              en: 'Used for the third series of data in charts and graphs. Provides visual distinction and clarity.',
              de: 'Verwendet für die dritte Reihe von Daten in Diagrammen und Grafiken. Bietet visuelle Unterscheidung und Klarheit.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(197, 37%, 24%)',
        },
        {
          name: 'chart-4',
          label: {
            en: 'Chart Color 4',
            de: 'Diagrammfarbe 4',
          },
          admin: {
            description: {
              en: 'Used for the fourth series of data in charts and graphs. Provides visual distinction and clarity.',
              de: 'Verwendet für die vierte Reihe von Daten in Diagrammen und Grafiken. Bietet visuelle Unterscheidung und Klarheit.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(43, 74%, 66%)',
        },
        {
          name: 'chart-5',
          label: {
            en: 'Chart Color 5',
            de: 'Diagrammfarbe 5',
          },
          admin: {
            description: {
              en: 'Used for the fifth series of data in charts and graphs. Provides visual distinction and clarity.',
              de: 'Verwendet für die fünfte Reihe von Daten in Diagrammen und Grafiken. Bietet visuelle Unterscheidung und Klarheit.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(27, 87%, 67%)',
        },
        {
          name: 'muted2',
          label: {
            en: 'Muted Background 2',
            de: 'Gedämpfter Hintergrund 2',
          },
          admin: {
            description: {
              en: 'Used for subtle background variations and disabled states. Creates visual depth without drawing attention.',
              de: 'Verwendet für subtile Hintergrundvariationen und deaktivierte Zustände. Erzeugt visuelle Tiefe ohne Aufmerksamkeit zu erregen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(0, 0%, 91%)',
        },
        {
          name: 'muted2-foreground',
          label: {
            en: 'Muted Text Color 2',
            de: 'Gedämpfte Textfarbe 2',
          },
          admin: {
            description: {
              en: 'Used for less prominent text like placeholders and disabled content. Provides subtle contrast against the background.',
              de: 'Verwendet für weniger prominenten Text wie Platzhalter und deaktivierte Inhalte. Bietet subtilen Kontrast zum Hintergrund.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(240, 3.8%, 46.1%)',
        },
      ],
    },
    {
      name: 'darkmodeColors',
      label: 'Darkmode Colors',
      type: 'group',
      fields: [
        {
          name: 'enableDarkMode',
          label: 'Enable Darkmode',
          type: 'checkbox',
        },
        {
          name: 'background',
          label: {
            en: 'Background Color',
            de: 'Hintergrundfarbe',
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(0, 0%, 0%)',
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'The main background color of the website. Used for the overall page background and provides the base canvas for all content.',
              de: 'Die Haupthintergrundfarbe der Website. Wird für den gesamten Seitenhintergrund verwendet und bildet die Grundlage für alle Inhalte.',
            },
          },
        },
        {
          name: 'foreground',
          label: {
            en: 'Text Color',
            de: 'Textfarbe',
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'The primary text color used throughout the website. Provides optimal contrast against the background for readability.',
              de: 'Die primäre Textfarbe, die auf der gesamten Website verwendet wird. Bietet optimalen Kontrast zum Hintergrund für beste Lesbarkeit.',
            },
          },
        },
        {
          name: 'card',
          label: {
            en: 'Card Background',
            de: 'Karten-Hintergrund',
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(240, 6%, 10%)',
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Background color for card components. Used for elevated surfaces that contain grouped content.',
              de: 'Hintergrundfarbe für Kartenkomponenten. Wird für erhöhte Oberflächen verwendet, die gruppierten Inhalt enthalten.',
            },
          },
        },
        {
          name: 'card-foreground',
          label: {
            en: 'Card Text Color',
            de: 'Karten-Textfarbe',
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Text color used within card components. Ensures readable content against the card background.',
              de: 'Textfarbe innerhalb von Kartenkomponenten. Gewährleistet lesbare Inhalte auf dem Kartenhintergrund.',
            },
          },
        },
        {
          name: 'popover',
          label: {
            en: 'Popover Background',
            de: 'Popover-Hintergrund',
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2 84%, 4.9%)',
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Background color for floating elements like dropdowns, tooltips, and popovers.',
              de: 'Hintergrundfarbe für schwebende Elemente wie Dropdown-Menüs, Tooltips und Popovers.',
            },
          },
        },
        {
          name: 'popover-foreground',
          label: {
            en: 'Popover Text Color',
            de: 'Popover-Textfarbe',
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Text color used within popover elements. Ensures content is readable against the popover background.',
              de: 'Textfarbe in Popover-Elementen. Stellt sicher, dass der Inhalt auf dem Popover-Hintergrund lesbar ist.',
            },
          },
        },
        {
          name: 'primary',
          label: {
            en: 'Primary Color',
            de: 'Primärfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Main brand color used for important interactive elements like primary buttons, links, and key UI components. This color should reflect your brand identity.',
              de: 'Hauptmarkenfarbe für wichtige interaktive Elemente wie primäre Schaltflächen, Links und zentrale UI-Komponenten. Diese Farbe sollte Ihre Markenidentität widerspiegeln.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
        },
        {
          name: 'primary-foreground',
          label: {
            en: 'Primary Text Color',
            de: 'Primäre Textfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Text color used on primary backgrounds. Ensures optimal contrast and readability for emphasized content.',
              de: 'Textfarbe auf primären Hintergründen. Gewährleistet optimalen Kontrast und Lesbarkeit für hervorgehobene Inhalte.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(222.2 47.4%, 11.2%)',
        },
        {
          name: 'secondary',
          label: {
            en: 'Secondary Color',
            de: 'Sekundärfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for secondary UI elements and alternative actions. Provides visual hierarchy and contrast to primary elements.',
              de: 'Verwendet für sekundäre UI-Elemente und alternative Aktionen. Bietet visuelle Hierarchie und Kontrast zu primären Elementen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(217.2 32.6%, 17.5%)',
        },
        {
          name: 'secondary-foreground',
          label: {
            en: 'Secondary Text Color',
            de: 'Sekundäre Textfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Text color for secondary UI elements. Ensures readability while maintaining visual distinction from primary text.',
              de: 'Textfarbe für sekundäre UI-Elemente. Gewährleistet Lesbarkeit bei gleichzeitiger visueller Unterscheidung vom primären Text.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
        },
        {
          name: 'muted',
          label: {
            en: 'Muted Background',
            de: 'Gedämpfter Hintergrund',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for subtle background variations and disabled states. Creates visual depth without drawing attention.',
              de: 'Verwendet für subtile Hintergrundvariationen und deaktivierte Zustände. Erzeugt visuelle Tiefe ohne Aufmerksamkeit zu erregen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(217.2 32.6%, 17.5%)',
        },
        {
          name: 'muted-foreground',
          label: {
            en: 'Muted Text Color',
            de: 'Gedämpfte Textfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for less prominent text like placeholders and disabled content. Provides subtle contrast against the background.',
              de: 'Verwendet für weniger prominenten Text wie Platzhalter und deaktivierte Inhalte. Bietet subtilen Kontrast zum Hintergrund.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(215, 20.2%, 65.1%)',
        },
        {
          name: 'accent',
          label: {
            en: 'Accent Color',
            de: 'Akzentfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for highlighting and emphasizing specific UI elements. Adds visual interest and draws attention to important features.',
              de: 'Verwendet für die Hervorhebung bestimmter UI-Elemente. Fügt visuelles Interesse hinzu und lenkt die Aufmerksamkeit auf wichtige Funktionen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(217.2 32.6%, 17.5%)',
        },
        {
          name: 'accent-foreground',
          label: {
            en: 'Accent Text Color',
            de: 'Akzent-Textfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Text color used on accent backgrounds. Ensures optimal contrast and readability for emphasized content.',
              de: 'Textfarbe auf Akzenthintergründen. Gewährleistet optimalen Kontrast und Lesbarkeit für hervorgehobene Inhalte.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
        },
        {
          name: 'destructive',
          label: {
            en: 'Destructive Color',
            de: 'Destruktive Farbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for destructive actions like deleting or removing content. Provides clear visual indication of potential negative consequences.',
              de: 'Verwendet für destruktive Aktionen wie das Löschen oder Entfernen von Inhalten. Bietet klare visuelle Anzeige möglicher negativer Konsequenzen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(0, 62.8%, 30.6%)',
        },
        {
          name: 'destructive-foreground',
          label: {
            en: 'Destructive Text Color',
            de: 'Destruktive Textfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Text color used on destructive backgrounds. Ensures optimal contrast and readability for emphasized content.',
              de: 'Textfarbe auf destruktiven Hintergründen. Gewährleistet optimalen Kontrast und Lesbarkeit für hervorgehobene Inhalte.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(210, 40%, 98%)',
        },
        {
          name: 'border',
          label: {
            en: 'Border Color',
            de: 'Rahmenfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for borders and outlines of UI elements. Provides visual separation and definition.',
              de: 'Verwendet für Ränder und Umrandungen von UI-Elementen. Bietet visuelle Trennung und Definition.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(240, 4%, 16%)',
        },
        {
          name: 'input',
          label: {
            en: 'Input Background',
            de: 'Eingabehintergrund',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Background color for input fields and text areas. Provides a clear and readable surface for user input.',
              de: 'Hintergrundfarbe für Eingabefelder und Textbereiche. Bietet eine klare und lesbare Oberfläche für Benutzereingaben.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(217.2 32.6%, 17.5%)',
        },
        {
          name: 'ring-3',
          label: {
            en: 'Ring Color',
            de: 'Ringfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for ring-3 or glow effects around interactive elements. Provides visual feedback and emphasis.',
              de: 'Verwendet für Ring- oder Glowe-Effekte um interaktive Elemente. Bietet visuelles Feedback und Betonung.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(212,.7 26.8%, 83.9%)',
        },
        {
          name: 'success',
          label: {
            en: 'Success Color',
            de: 'Erfolgfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for success messages and positive feedback. Provides a clear visual indication of successful actions.',
              de: 'Verwendet für Erfolgsmeldungen und positives Feedback. Bietet eine klare visuelle Anzeige erfolgreicher Aktionen.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(196, 100%, 14%)',
        },
        {
          name: 'warning',
          label: {
            en: 'Warning Color',
            de: 'Warnfarbe',
          },
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
            description: {
              en: 'Used for warning messages and cautionary feedback. Provides a clear visual indication of potential issues.',
              de: 'Verwendet für Warnmeldungen und vorsichtiges Feedback. Bietet eine klare visuelle Anzeige möglicher Probleme.',
            },
          },
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(34, 51%, 25%)',
        },
        {
          name: 'error',
          type: 'text',
          validate: validateCssColor,
          defaultValue: 'hsl(10, 39%, 43%)',
          admin: {
            condition: (_, { enableDarkMode } = {}) => enableDarkMode,
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateThemeConfig],
  },
}
