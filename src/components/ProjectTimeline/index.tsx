import React from 'react'

interface ProjectTimelineProps {
  startDate?: string | null
  endDate?: string | null
  locale?: string
}

/**
 * ProjectTimeline component that displays project date range (month and year only)
 *
 * @param {string | null} startDate - Project start date
 * @param {string | null} endDate - Project completion date
 * @param {string} locale - Locale for date formatting (defaults to 'en')
 * @returns {React.ReactElement | null} - Timeline display or null if no dates
 */
export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  startDate,
  endDate,
  locale = 'en',
}) => {
  if (!startDate) return null

  const formatMonthYear = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    }
    return dateObj.toLocaleDateString(locale, options)
  }

  return (
    <div className="text-muted-foreground text-sm">
      {formatMonthYear(startDate)}
      {endDate ? (
        <>
          {' - '}
          {formatMonthYear(endDate)}
        </>
      ) : (
        ' - Present'
      )}
    </div>
  )
}

export default ProjectTimeline
