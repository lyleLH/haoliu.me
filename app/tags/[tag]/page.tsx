import { genPageMetadata } from 'app/seo'
import { slug } from 'github-slugger'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllBlogs, getAllSnippets, sortPosts, allCoreContent } from '~/server/content-api'
import { SITE_METADATA } from '~/data/site-metadata'
import { ListLayoutWithTags } from '~/layouts/list-layout-with-tags'

export const revalidate = 5

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${SITE_METADATA.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${SITE_METADATA.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURI(params.tag)
  const title = '#' + tag[0] + tag.split(' ').join('-').slice(1)

  const [blogs, snippets] = await Promise.all([getAllBlogs(), getAllSnippets()])

  const filteredPosts = allCoreContent(
    sortPosts(blogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  const filteredSnippets = allCoreContent(
    sortPosts(snippets.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  if (filteredPosts.length === 0 && filteredSnippets.length === 0) {
    return notFound()
  }
  return (
    <ListLayoutWithTags
      title={title}
      description={
        <>
          Things I've written about <span className="ml-2 font-medium">#{tag}</span>
        </>
      }
      posts={filteredPosts}
      snippets={filteredSnippets}
    />
  )
}
