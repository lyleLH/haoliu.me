'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Bookmark, ImageIcon, MessageCircle, Hash, ExternalLink } from 'lucide-react'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import type { MomentEntry } from '~/server/content-api'

const API_BASE = process.env.NEXT_PUBLIC_CONTENT_API_URL || ''

function resolveMediaUrl(url: string) {
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

export function MomentsTimeline({
  initialEntries,
  initialHasMore,
}: {
  initialEntries: MomentEntry[]
  initialHasMore: boolean
}) {
  const [entries, setEntries] = useState(initialEntries)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await fetch(`${API_BASE}/api/content/moments?page=${nextPage}&limit=20`)
      const data = await res.json()
      setEntries((prev) => [...prev, ...data.entries])
      setHasMore(data.hasMore)
      setPage(nextPage)
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  // Group entries by date
  const groups = groupByDate(entries)

  return (
    <div className="space-y-8">
      {groups.map(({ label, items }) => (
        <div key={label}>
          <div className="sticky top-0 z-10 mb-4 flex items-center gap-2 bg-white/80 py-2 backdrop-blur dark:bg-gray-950/80">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="space-y-4">
            {items.map((entry) => (
              <MomentCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className={clsx(
              'rounded-lg px-6 py-2 text-sm font-medium transition-colors',
              'bg-gray-100 text-gray-700 hover:bg-gray-200',
              'dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
              loading && 'cursor-not-allowed opacity-50'
            )}
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

      {entries.length === 0 && (
        <div className="py-20 text-center text-gray-500 dark:text-gray-400">
          No moments yet.
        </div>
      )}
    </div>
  )
}

function MomentCard({ entry }: { entry: MomentEntry }) {
  const time = new Date(entry.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const TypeIcon = entry.type === 'bookmark' ? Bookmark : entry.type === 'photo' ? ImageIcon : MessageCircle

  return (
    <div
      className={clsx(
        'relative rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md',
        'dark:border-gray-700/50 dark:bg-gray-900'
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <TypeIcon size={14} />
        <span>{time}</span>
      </div>

      {/* Text content */}
      {entry.content && (
        <p className="mb-3 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
          {entry.content}
        </p>
      )}

      {/* Media */}
      {entry.media.length > 0 && (
        <div className={clsx('mb-3 gap-2', entry.media.length > 1 ? 'grid grid-cols-2' : '')}>
          {entry.media.map((m, i) =>
            m.type === 'video' ? (
              <video
                key={i}
                src={resolveMediaUrl(m.url)}
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: 400 }}
              />
            ) : (
              <Link key={i} href={resolveMediaUrl(m.url)} className="block">
                <Image
                  src={resolveMediaUrl(m.url)}
                  alt=""
                  width={m.width || 800}
                  height={m.height || 600}
                  className="rounded-lg object-cover"
                />
              </Link>
            )
          )}
        </div>
      )}

      {/* Bookmark */}
      {entry.bookmark && (
        <Link
          href={entry.bookmark.url}
          className="mb-3 flex overflow-hidden rounded-lg border border-gray-200 no-underline transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          {entry.bookmark.image && (
            <div className="hidden w-32 shrink-0 sm:block">
              <Image
                src={resolveMediaUrl(entry.bookmark.image)}
                alt=""
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col justify-center p-3">
            <div className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
              {entry.bookmark.title || entry.bookmark.url}
            </div>
            {entry.bookmark.description && (
              <div className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {entry.bookmark.description}
              </div>
            )}
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <ExternalLink size={10} />
              <span>{new URL(entry.bookmark.url).hostname}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className={clsx(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs',
                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              )}
            >
              <Hash size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// --- Helpers ---

function groupByDate(entries: MomentEntry[]): { label: string; items: MomentEntry[] }[] {
  const groups: Map<string, MomentEntry[]> = new Map()

  for (const entry of entries) {
    const date = new Date(entry.createdAt)
    const key = date.toISOString().split('T')[0]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(entry)
  }

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  return Array.from(groups.entries()).map(([key, items]) => {
    let label = key
    if (key === today) label = 'Today'
    else if (key === yesterday) label = 'Yesterday'
    else label = new Date(key + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return { label, items }
  })
}
