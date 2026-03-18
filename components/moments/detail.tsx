import clsx from 'clsx'
import { Bookmark, ImageIcon, MessageCircle, ExternalLink } from 'lucide-react'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { GradientBorder } from '~/components/ui/gradient-border'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { MomentEntry } from '~/server/content-api'

const API_BASE = process.env.NEXT_PUBLIC_CONTENT_API_URL || ''

function resolveMediaUrl(url: string) {
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

export function MomentDetail({ entry }: { entry: MomentEntry }) {
  const date = new Date(entry.createdAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const TypeIcon =
    entry.type === 'bookmark' ? Bookmark : entry.type === 'photo' ? ImageIcon : MessageCircle

  return (
    <GradientBorder className="rounded-2xl">
      <article className="relative rounded-2xl bg-zinc-50 dark:bg-white/5">
        <TiltedGridBackground className="inset-0" />

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

        <div className="relative space-y-3 p-5">
          <div className="flex items-center gap-x-1.5 text-sm text-gray-500 dark:text-gray-400">
            <TypeIcon size={14} />
            <span>{formattedDate} · {time}</span>
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

          {entry.content && (
            <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-800 dark:text-gray-200">
              {entry.content}
            </p>
          )}

          {entry.bookmark && (
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
