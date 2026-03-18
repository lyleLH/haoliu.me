import clsx from 'clsx'
import { Star, ExternalLink, Twitter } from 'lucide-react'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { GrowingUnderline } from '~/components/ui/growing-underline'

// --- Tweet Card ---

export function TweetCard({
  url,
  authorName,
  handle,
  text,
}: {
  url: string
  authorName: string
  handle: string // username stored in bookmark.image
  text: string   // tweet text stored in bookmark.description
}) {
  const avatarUrl = handle
    ? `https://unavatar.io/twitter/${handle}`
    : null

  return (
    <Link
      href={url}
      className={clsx(
        'block rounded-xl p-4 no-underline',
        'bg-white dark:bg-white/5',
        'transition-shadow hover:shadow-md'
      )}
    >
      <div className="flex items-start gap-3">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt={authorName}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {authorName || handle}
            </span>
            {handle && (
              <span className="text-sm text-gray-400 dark:text-gray-500">@{handle}</span>
            )}
            <Twitter size={14} className="ml-auto shrink-0 text-[#1DA1F2]" />
          </div>
          {text && (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {text}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

// --- YouTube Embed ---

export function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}

// --- GitHub Repo Card ---

export function GitHubRepoCard({
  url,
  title,
  description,
  image,
}: {
  url: string
  title: string
  description: string
  image: string | null
}) {
  const parts = description.split(' · ')
  const descText = parts[0] || ''
  const language = parts.find((p) => p.startsWith('Language:'))?.replace('Language: ', '')
  const stars = parts.find((p) => p.startsWith('Stars:'))?.replace('Stars: ', '')

  return (
    <Link
      href={url}
      className={clsx(
        'flex items-start gap-4 rounded-xl p-4 no-underline',
        'bg-white dark:bg-white/5',
        'transition-shadow hover:shadow-md'
      )}
    >
      {image && (
        <Image
          src={image}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-lg"
        />
      )}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          <GrowingUnderline>{title}</GrowingUnderline>
        </h4>
        {descText && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{descText}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          {language && (
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              {language}
            </span>
          )}
          {stars && (
            <span className="flex items-center gap-0.5">
              <Star size={12} />
              {stars}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <ExternalLink size={10} />
            github.com
          </span>
        </div>
      </div>
    </Link>
  )
}
