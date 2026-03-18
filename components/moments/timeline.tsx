'use client'

import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { Bookmark, ImageIcon, MessageCircle, ExternalLink, Twitter, Youtube, Github } from 'lucide-react'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { GradientBorder } from '~/components/ui/gradient-border'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { TweetCard, YouTubeEmbed, GitHubRepoCard } from './embeds'
import { MomentsCalendar } from './calendar'
import { TypeFilter } from './type-filter'
import { TagsPanel } from './tags-panel'
import type { MomentEntry } from '~/server/content-api'

const API_BASE = process.env.NEXT_PUBLIC_CONTENT_API_URL || ''

function resolveMediaUrl(url: string) {
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

export function MomentsTimeline({
  initialEntries,
  initialHasMore,
  activeDates,
  allTags,
}: {
  initialEntries: MomentEntry[]
  initialHasMore: boolean
  activeDates: string[]
  allTags: Record<string, number>
}) {
  const [entries, setEntries] = useState(initialEntries)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const activeDateSet = new Set(activeDates)

  const fetchEntries = useCallback(
    async (date: string | null, tag: string | null, pg = 1, type: string | null = null) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(pg), limit: '20' })
        if (date) params.set('date', date)
        if (tag) params.set('tag', tag)
        if (type) params.set('type', type)
        const res = await fetch(`${API_BASE}/api/content/moments?${params}`)
        const data = await res.json()
        if (pg === 1) {
          setEntries(data.entries)
        } else {
          setEntries((prev) => [...prev, ...data.entries])
        }
        setHasMore(data.hasMore)
        setPage(pg)
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date)
    fetchEntries(date, selectedTag, 1, selectedType)
  }

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
    fetchEntries(selectedDate, tag, 1, selectedType)
  }

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type)
    fetchEntries(selectedDate, selectedTag, 1, type)
  }

  const loadMore = () => {
    fetchEntries(selectedDate, selectedTag, page + 1, selectedType)
  }

  const groups = groupByDate(entries)

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Left sidebar — Calendar + Type Filter */}
      <aside className="w-full shrink-0 lg:w-56">
        <div className="space-y-4 lg:sticky lg:top-24">
          <MomentsCalendar
            activeDates={activeDateSet}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />
          <TypeFilter
            selectedType={selectedType}
            onSelectType={handleTypeSelect}
          />
        </div>
      </aside>

      {/* Center — Timeline */}
      <main className="min-w-0 flex-1">
        {/* Active filter indicator */}
        {(selectedDate || selectedTag || selectedType) && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Filtered by:</span>
            {selectedDate && (
              <span className="rounded-lg bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {selectedDate}
              </span>
            )}
            {selectedTag && (
              <span className="rounded-lg bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                #{selectedTag}
              </span>
            )}
            {selectedType && (
              <span className="rounded-lg bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {selectedType}
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDate(null)
                setSelectedTag(null)
                setSelectedType(null)
                fetchEntries(null, null, 1, null)
              }}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="space-y-10">
          {groups.map(({ label, items }) => (
            <div key={label}>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {label}
              </h2>
              <div className="space-y-5">
                {items.map((entry) => (
                  <MomentCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className={clsx(
                  'rounded-xl px-8 py-2.5 text-sm font-semibold transition-all',
                  'border-2 border-gray-800 dark:border-gray-400',
                  'text-gray-800 dark:text-gray-200',
                  'hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-900',
                  loading && 'cursor-not-allowed opacity-50'
                )}
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}

          {entries.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">
              No moments found.
            </div>
          )}

          {loading && entries.length === 0 && (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>
          )}
        </div>
      </main>

      {/* Right sidebar — Tags */}
      <aside className="w-full shrink-0 lg:w-48">
        <div className="lg:sticky lg:top-24">
          <TagsPanel tags={allTags} selectedTag={selectedTag} onSelectTag={handleTagSelect} />
        </div>
      </aside>
    </div>
  )
}

function MomentCard({ entry }: { entry: MomentEntry }) {
  const time = new Date(entry.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const typeIcons: Record<string, typeof Bookmark> = {
    bookmark: Bookmark,
    photo: ImageIcon,
    tweet: Twitter,
    youtube: Youtube,
    github: Github,
    text: MessageCircle,
  }
  const TypeIcon = typeIcons[entry.type] || MessageCircle

  return (
    <GradientBorder className="rounded-2xl">
      <article
        className={clsx(
          'relative rounded-2xl',
          'bg-zinc-50 dark:bg-white/5',
          'transition-shadow hover:shadow-md',
          'hover:shadow-zinc-900/5 dark:hover:shadow-black/15'
        )}
      >
        <TiltedGridBackground className="inset-0" />

        {/* Photo media */}
        {entry.media.length > 0 && (
          <div className={clsx('relative gap-1 p-4 pb-0', entry.media.length > 1 ? 'grid grid-cols-2' : '')}>
            {entry.media.map((m, i) =>
              m.type === 'video' ? (
                <video
                  key={i}
                  src={resolveMediaUrl(m.url)}
                  controls
                  className="w-full rounded-xl"
                  style={{ maxHeight: 480 }}
                />
              ) : (
                <Image
                  key={i}
                  src={resolveMediaUrl(m.url)}
                  alt=""
                  width={m.width || 800}
                  height={m.height || 600}
                  className="rounded-xl object-cover"
                  style={{ maxHeight: 480 }}
                />
              )
            )}
          </div>
        )}

        {/* Content area */}
        <div className="relative space-y-3 p-5">
          {/* Meta line */}
          <div className="flex items-center gap-x-1.5 text-sm text-gray-500 dark:text-gray-400">
            <TypeIcon size={14} />
            <span>{time}</span>
            {entry.tags.length > 0 && (
              <>
                <span className="mx-1 text-gray-400">/</span>
                {entry.tags.map((tag) => (
                  <span key={tag}>
                    <GrowingUnderline>#{tag}</GrowingUnderline>
                  </span>
                ))}
              </>
            )}
          </div>

          {/* Text content */}
          {entry.content && (
            <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-800 dark:text-gray-200">
              {entry.content}
            </p>
          )}

          {/* Embeds */}
          {entry.type === 'tweet' && entry.bookmark && (
            <TweetCard
              url={entry.bookmark.url}
              authorName={entry.bookmark.title}
              handle={entry.bookmark.image || ''}
              text={entry.bookmark.description || ''}
            />
          )}

          {entry.type === 'youtube' && entry.bookmark?.embedId && (
            <YouTubeEmbed videoId={entry.bookmark.embedId} />
          )}

          {entry.type === 'github' && entry.bookmark && (
            <GitHubRepoCard
              url={entry.bookmark.url}
              title={entry.bookmark.title || entry.bookmark.url}
              description={entry.bookmark.description || ''}
              image={entry.bookmark.image ? resolveMediaUrl(entry.bookmark.image) : null}
            />
          )}

          {/* Regular bookmark fallback */}
          {entry.type === 'bookmark' && entry.bookmark && (
            <Link
              href={entry.bookmark.url}
              className={clsx(
                'flex overflow-hidden rounded-xl no-underline',
                'bg-white dark:bg-white/5',
                'transition-shadow hover:shadow-md'
              )}
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
              <div className="flex flex-col justify-center p-4">
                <h4 className="line-clamp-1 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                  <GrowingUnderline>{entry.bookmark.title || entry.bookmark.url}</GrowingUnderline>
                </h4>
                {entry.bookmark.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {entry.bookmark.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <ExternalLink size={10} />
                  <span>{new URL(entry.bookmark.url).hostname}</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </article>
    </GradientBorder>
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
    else
      label = new Date(key + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    return { label, items }
  })
}
