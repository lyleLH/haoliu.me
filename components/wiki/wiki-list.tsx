'use client'

import { useState } from 'react'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Wiki } from 'contentlayer/generated'
import { WikiCard } from '~/components/cards/wiki'
import { SearchArticles } from '~/components/blog/search-articles'

interface WikiListProps {
  posts: CoreContent<Wiki>[]
}

export function WikiList({ posts }: WikiListProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <SearchArticles label="Search wiki" onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      {!filteredPosts.length ? (
        <div className="py-10">No posts found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 py-10 md:gap-y-16 lg:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((wiki) => (
            <WikiCard key={wiki.path} wiki={wiki} />
          ))}
        </div>
      )}
    </>
  )
}
