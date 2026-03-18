'use client'

import clsx from 'clsx'
import { MessageCircle, ImageIcon, Bookmark, Twitter, Youtube, Github } from 'lucide-react'

const TYPES = [
  { value: 'text', label: 'Text', Icon: MessageCircle },
  { value: 'photo', label: 'Photo', Icon: ImageIcon },
  { value: 'bookmark', label: 'Bookmark', Icon: Bookmark },
  { value: 'tweet', label: 'Tweet', Icon: Twitter },
  { value: 'youtube', label: 'YouTube', Icon: Youtube },
  { value: 'github', label: 'GitHub', Icon: Github },
] as const

interface TypeFilterProps {
  selectedType: string | null
  onSelectType: (type: string | null) => void
}

export function TypeFilter({ selectedType, onSelectType }: TypeFilterProps) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
      <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Type</h3>
      <div className="flex flex-col gap-1">
        {TYPES.map(({ value, label, Icon }) => {
          const isSelected = selectedType === value
          return (
            <button
              key={value}
              onClick={() => onSelectType(isSelected ? null : value)}
              className={clsx(
                'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                isSelected
                  ? 'bg-gray-800 font-semibold text-white dark:bg-gray-200 dark:text-gray-900'
                  : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
              )}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      {selectedType && (
        <button
          onClick={() => onSelectType(null)}
          className="mt-3 w-full rounded-lg py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Clear filter
        </button>
      )}
    </div>
  )
}
