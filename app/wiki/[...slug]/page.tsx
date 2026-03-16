import 'css/prism.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllWikis,
  getWikiBySlug,
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

const DEFAULT_LAYOUT = 'PostLayout'
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
    const wiki = await getWikiBySlug(slug)
    const authorSlugs = wiki.authors || ['default']
    const authorDetails = await Promise.all(authorSlugs.map(getAuthorBySlug))

    const publishedAt = new Date(wiki.date).toISOString()
    const modifiedAt = new Date(wiki.lastmod || wiki.date).toISOString()
    const authors = authorDetails.map((a) => a.name)
    let imageList = [SITE_METADATA.socialBanner]
    if (wiki.images?.length) imageList = wiki.images
    const ogImages = imageList.map((img) => ({
      url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
    }))

    return {
      title: wiki.title,
      description: wiki.summary,
      openGraph: {
        title: wiki.title,
        description: wiki.summary,
        type: 'article',
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        authors: authors.length > 0 ? authors : [SITE_METADATA.author],
        images: ogImages,
      },
      twitter: {
        title: wiki.title,
        description: wiki.summary,
        images: ogImages,
      },
    }
  } catch {
    return undefined
  }
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))

  const [allWikiPosts, wiki] = await Promise.all([
    getAllWikis(),
    getWikiBySlug(slug).catch(() => null),
  ])

  if (!wiki) return notFound()

  const sortedPosts = allCoreContent(sortPosts(allWikiPosts))
  const idx = sortedPosts.findIndex((p) => p.slug === slug)
  const prev = idx >= 0 ? sortedPosts[idx + 1] : undefined
  const next = idx >= 0 ? sortedPosts[idx - 1] : undefined

  const authorSlugs = wiki.authors || ['default']
  const authorDetails = await Promise.all(authorSlugs.map(getAuthorBySlug))

  const mainContent = { ...wiki, type: 'Wiki' as const }
  const jsonLd = {
    ...wiki.structuredData,
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name })),
  }

  const Layout = LAYOUTS[wiki.layout || DEFAULT_LAYOUT]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXRenderer source={wiki.rawContent || ''} />
      </Layout>
    </>
  )
}
