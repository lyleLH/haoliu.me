'use client'

import type { Blog, Wiki } from 'contentlayer/generated'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { useState } from 'react'
import { PostCardGridView } from '~/components/blog/post-card-grid-view'
import { WikiCard } from '~/components/cards/wiki'
import { SearchArticles } from '~/components/blog/search-articles'
import { Link } from '~/components/ui/link'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { PageHeader } from '~/components/ui/page-header'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog | Wiki>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog | Wiki>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {prevPage ? (
          <Link
            className="cursor-pointer"
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            <GrowingUnderline className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </GrowingUnderline>
          </Link>
        ) : (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            <GrowingUnderline className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </GrowingUnderline>
          </button>
        )}
        <span>
          {currentPage} / {totalPages}
        </span>
        {nextPage ? (
          <Link className="cursor-pointer" href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            <GrowingUnderline className="inline-flex items-center gap-2">
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </GrowingUnderline>
          </Link>
        ) : (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            <GrowingUnderline className="inline-flex items-center gap-2">
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </GrowingUnderline>
          </button>
        )}
      </nav>
    </div>
  )
}

export function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredPosts

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title={title}
        description="I like to write about stuff I'm into. You'll find a mix of web dev articles, tech news, and random thoughts from my life. Use the search below to filter by title."
        className="border-b border-gray-200 dark:border-gray-700"
      >
        <SearchArticles label="Search articles" onChange={(e) => setSearchValue(e.target.value)} />
      </PageHeader>
      {!filteredPosts.length ? (
        <div className="py-10">No posts found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 py-10 md:gap-y-16 lg:grid-cols-2 xl:grid-cols-3">
          {displayPosts.map((post) =>
            post.type === 'Blog' ? (
              <PostCardGridView key={post.path} post={post as CoreContent<Blog>} />
            ) : (
              <WikiCard key={post.path} wiki={post as CoreContent<Wiki>} />
            )
          )}
        </div>
      )}
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </Container>
  )
}
