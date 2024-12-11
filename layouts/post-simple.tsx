import type { Blog, Snippet } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { ReactNode } from 'react'
import { BackToPosts } from '~/components/blog/back-to-posts'
import { BlogMeta } from '~/components/blog/blog-meta'
import { Comments } from '~/components/blog/comments'
import { PostTitle } from '~/components/blog/post-title'
import { ScrollButtons } from '~/components/blog/scroll-buttons'
import { SocialShare } from '~/components/blog/social-share'
import { TagsList } from '~/components/blog/tags'
import { Container } from '~/components/ui/container'
import { SITE_METADATA } from '~/data/site-metadata'

interface PostSimpleProps {
  content: CoreContent<Blog | Snippet>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostSimple({ content, children }: PostSimpleProps) {
  const { slug, date, title, type, tags, readingTime, filePath } = content
  const postUrl = `${SITE_METADATA.siteUrl}/${type.toLowerCase()}/${slug}`

  return (
    <Container className="pt-4 lg:pt-12">
      <ScrollButtons />
      <article className="space-y-6 divide-y divide-gray-200 pt-6 dark:divide-gray-700 lg:space-y-12">
        <div className="space-y-4">
          <TagsList tags={tags} />
          <PostTitle>{title}</PostTitle>
          <dl>
            <div>
              <dt className="sr-only">Published on</dt>
              <BlogMeta date={date} slug={slug} readingTime={readingTime} />
            </div>
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
