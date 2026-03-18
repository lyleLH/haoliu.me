'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MomentsCalendarProps {
  activeDates: Set<string>
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

export function MomentsCalendar({ activeDates, selectedDate, onSelectDate }: MomentsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const { year, month } = currentMonth
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  const prevMonth = () => {
    setCurrentMonth((prev) =>
      prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 }
    )
  }

  const nextMonth = () => {
    setCurrentMonth((prev) =>
      prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 }
    )
  }

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
      {/* Month navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-lg p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="rounded-lg p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-gray-400 dark:text-gray-500">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 text-center text-sm">
        {days.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasEntry = activeDates.has(dateStr)
          const isSelected = selectedDate === dateStr

          return (
            <button
              key={dateStr}
              onClick={() => {
                if (hasEntry) onSelectDate(isSelected ? null : dateStr)
              }}
              disabled={!hasEntry}
              className={clsx(
                'relative mx-auto my-0.5 flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors',
                isSelected && 'bg-gray-800 font-semibold text-white dark:bg-gray-200 dark:text-gray-900',
                !isSelected && hasEntry && 'cursor-pointer font-medium text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700',
                !hasEntry && 'text-gray-300 dark:text-gray-600'
              )}
            >
              {day}
              {hasEntry && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Clear filter */}
      {selectedDate && (
        <button
          onClick={() => onSelectDate(null)}
          className="mt-3 w-full rounded-lg py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Clear filter
        </button>
      )}
    </div>
  )
}
