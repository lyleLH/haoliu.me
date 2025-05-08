import { clsx } from 'clsx'
import type { Wiki } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'

export function WikiCard({ wiki }: { wiki: CoreContent<Wiki> }) {
  const { path, date, title, summary, tags, link } = wiki
  const href = link || `/${path}`

  return (
    <GradientBorder className="relative z-0 rounded-2xl">
      <Link
        href={href}
        title={title}
        className={clsx([
          'relative flex h-full rounded-2xl',
          'bg-zinc-50 dark:bg-white/5',
          'transition-shadow hover:shadow-md',
          'hover:shadow-zinc-900/5 dark:hover:shadow-black/15',
        ])}
        {...(link && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        <TiltedGridBackground className="inset-0" />
        <div className="relative w-full px-4 pb-6 pt-6">
          <div className="flex items-center gap-2">
            <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={date}>
              {formatDate(date)}
            </time>
            {tags && tags.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{tags[0]}</span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-semibold leading-7">
            <GrowingUnderline>{title}</GrowingUnderline>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-zinc-600 dark:text-zinc-400">{summary}</p>
        </div>
      </Link>
    </GradientBorder>
  )
}
