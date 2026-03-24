import React from 'react'

interface DateFormatterProps {
  date: string | Date
  locale?: string
  className?: string
}

/**
 * DateFormatter component that formats dates based on locale
 *
 * @param {string | Date} date - The date to format
 * @param {Locale} locale - The locale to use for formatting (defaults to 'en')
 * @param {string} className - Optional CSS class name
 * @returns {React.ReactElement} - Formatted date
 */
export const DateFormatter: React.FC<DateFormatterProps> = ({
  date,
  locale = 'en',
  className = '',
}) => {
  if (!date) return null

  const dateObj = typeof date === 'string' ? new Date(date) : date

  // Format options based on locale
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  // For German (DE), use European format (day-month-year)
  // For English (EN), use US format (month-day-year)
  // The Intl.DateTimeFormat will handle this automatically based on the locale

  return (
    <time dateTime={dateObj.toISOString()} className={className}>
      {dateObj.toLocaleDateString(locale, options)}
    </time>
  )
}

export default DateFormatter
