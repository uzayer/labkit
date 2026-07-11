'use client'

import { AlignLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/utils'
import { getSideMenuStructure } from '@/utilities/richtext'

type TableOfContentsProps = {
  content: any
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const sideMenuStructure = useMemo(() => {
    return content ? getSideMenuStructure(content, { headlineLevels: ['h2', 'h3'] }) : []
  }, [content])

  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (sideMenuStructure.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      },
    )

    sideMenuStructure.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [sideMenuStructure])

  if (sideMenuStructure.length === 0) return null

  return (
    <div className="sticky top-8 hidden h-fit shrink-0 lg:block lg:w-56">
      <span className="flex items-center gap-2 text-sm">
        <AlignLeft className="h-4 w-4" />
        On this page
      </span>
      <nav className="mt-2 text-sm">
        <ul>
          {sideMenuStructure.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'block py-1 transition-colors duration-200',
                  activeSection === item.id
                    ? 'font-medium text-primary'
                    : 'text-muted-foreground hover:text-primary',
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
