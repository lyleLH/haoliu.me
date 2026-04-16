import type { ContentPost } from '~/server/content-api'

import type { ReactNode } from 'react'
import { Comments } from '~/components/blog/comments'
import { PostTitle } from '~/components/blog/post-title'
import { ScrollButtons } from '~/components/blog/scroll-buttons'
import { TagsList } from '~/components/blog/tags'
import { Container } from '~/components/ui/container'
import { Twemoji } from '~/components/ui/twemoji'
import { formatDate } from '~/utils/misc'

interface WikiLayoutProps {
  content: ContentPost
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function WikiLayout({ content, children }: WikiLayoutProps) {
  const { slug, date, title, tags, readingTime } = content

  return (
    <Container className="pt-4 lg:pt-12">
      <ScrollButtons />
      <article className="space-y-6 divide-y divide-gray-200 pt-6 dark:divide-gray-700 lg:space-y-12">
        <div className="space-y-4">
          <TagsList tags={tags} />
          <PostTitle>{title}</PostTitle>
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="flex flex-wrap items-center gap-2 text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 md:gap-3 md:text-base">
              {date && (
                <time dateTime={date} className="flex items-center justify-center">
                  <Twemoji emoji="calendar" size="base" />
                  <span className="ml-1.5 md:ml-2">{formatDate(date)}</span>
                </time>
              )}
              {date && readingTime?.minutes ? (
                <span className="text-gray-400">/</span>
              ) : null}
              {readingTime?.minutes ? (
                <div className="flex items-center">
                  <Twemoji emoji="three-o-clock" size="base" />
                  <span className="ml-1.5 md:ml-2">
                    {Math.ceil(readingTime.minutes)} mins read
                  </span>
                </div>
              ) : null}
            </dd>
          </dl>
        </div>
        <div className="xl:col-span-3 xl:row-span-2 xl:pb-0">
          <div className="prose max-w-none pb-8 dark:prose-invert">{children}</div>
          <div className="border-t">
            <Comments slug={slug} />
          </div>
        </div>
      </article>
    </Container>
  )
}
