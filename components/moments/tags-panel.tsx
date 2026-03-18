'use client'

import clsx from 'clsx'
import { GrowingUnderline } from '~/components/ui/growing-underline'

interface TagsPanelProps {
  tags: Record<string, number>
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
}

export function TagsPanel({ tags, selectedTag, onSelectTag }: TagsPanelProps) {
  const sorted = Object.entries(tags).sort((a, b) => b[1] - a[1])

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
        <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Tags</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">No tags yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
      <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {sorted.map(([tag, count]) => {
          const isSelected = selectedTag === tag
          return (
            <button
              key={tag}
              onClick={() => onSelectTag(isSelected ? null : tag)}
              className={clsx(
                'inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm transition-all',
                isSelected
                  ? 'bg-gray-800 font-semibold text-white dark:bg-gray-200 dark:text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              {isSelected ? (
                <span>#{tag}</span>
              ) : (
                <GrowingUnderline>#{tag}</GrowingUnderline>
              )}
              <span
                className={clsx(
                  'text-xs',
                  isSelected ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {selectedTag && (
        <button
          onClick={() => onSelectTag(null)}
          className="mt-3 w-full rounded-lg py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Clear filter
        </button>
      )}
    </div>
  )
}
