import 'css/prism.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllSnippets,
  getSnippetBySlug,
  getAuthorBySlug,
  sortPosts,
  allCoreContent,
} from '~/server/content-api'
import { MDXRenderer } from '~/components/mdx/mdx-renderer'
import { SITE_METADATA } from '~/data/site-metadata'
import { PostBanner } from '~/layouts/post-banner'
import { PostLayout } from '~/layouts/post-layout'
import { PostSimple } from '~/layouts/post-simple'

export const revalidate = 5

const DEFAULT_LAYOUT = 'PostSimple'
const LAYOUTS: Record<string, typeof PostLayout> = {
  PostSimple: PostSimple as unknown as typeof PostLayout,
  PostLayout,
  PostBanner: PostBanner as unknown as typeof PostLayout,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  try {
    const snippet = await getSnippetBySlug(slug)
    const authorSlugs = snippet.authors || ['default']
    const authorDetails = await Promise.all(authorSlugs.map(getAuthorBySlug))

    const publishedAt = new Date(snippet.date).toISOString()
    const modifiedAt = new Date(snippet.lastmod || snippet.date).toISOString()
    const authors = authorDetails.map((a) => a.name)
    let imageList = [SITE_METADATA.socialBanner]
    if (snippet.images?.length) imageList = snippet.images
    const ogImages = imageList.map((img) => ({
      url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
    }))

    return {
      title: snippet.title,
      description: snippet.summary,
      openGraph: {
        title: snippet.title,
        description: snippet.summary,
        siteName: SITE_METADATA.title,
        locale: 'en_US',
        type: 'article',
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        url: './',
        images: ogImages,
        authors: authors.length > 0 ? authors : [SITE_METADATA.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: snippet.title,
        description: snippet.summary,
        images: imageList,
      },
    }
  } catch {
    return undefined
  }
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))

  const [allSnippets, snippet] = await Promise.all([
    getAllSnippets(),
    getSnippetBySlug(slug).catch(() => null),
  ])

  if (!snippet) return notFound()

  const sortedPosts = allCoreContent(sortPosts(allSnippets))
  const idx = sortedPosts.findIndex((p) => p.slug === slug)
  const prev = idx >= 0 ? sortedPosts[idx + 1] : undefined
  const next = idx >= 0 ? sortedPosts[idx - 1] : undefined

  const authorSlugs = snippet.authors || ['default']
  const authorDetails = await Promise.all(authorSlugs.map(getAuthorBySlug))

  const mainContent = { ...snippet, type: 'Snippet' as const }
  const jsonLd = {
    ...snippet.structuredData,
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name })),
  }

  const Layout = LAYOUTS[snippet.layout || DEFAULT_LAYOUT]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXRenderer source={snippet.rawContent || ''} />
      </Layout>
    </>
  )
}
