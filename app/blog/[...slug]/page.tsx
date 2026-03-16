import 'css/prism.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllBlogs,
  getBlogBySlug,
  getAuthorBySlug,
  sortPosts,
  allCoreContent,
} from '~/server/content-api'
import { MDXRenderer } from '~/components/mdx/mdx-renderer'
import { MDX_COMPONENTS } from '~/components/mdx'
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
  const slug = decodeURI((await params).slug.join('/'))
  try {
    const post = await getBlogBySlug(slug)
    const authorSlugs = post.authors || ['default']
    const authorDetails = await Promise.all(authorSlugs.map(getAuthorBySlug))

    const publishedAt = new Date(post.date).toISOString()
    const modifiedAt = new Date(post.lastmod || post.date).toISOString()
    const authors = authorDetails.map((a) => a.name)
    let imageList = [SITE_METADATA.socialBanner]
    if (post.images?.length) {
      imageList = post.images
    }
    const ogImages = imageList.map((img) => ({
      url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
    }))

    return {
      title: post.title,
      description: post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
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
        title: post.title,
        description: post.summary,
        images: imageList,
      },
    }
  } catch {
    return undefined
  }
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))

  const [allBlogs, post] = await Promise.all([
    getAllBlogs(),
    getBlogBySlug(slug).catch(() => null),
  ])

  if (!post) return notFound()

  const sortedPosts = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  const prev = postIndex >= 0 ? sortedPosts[postIndex + 1] : undefined
  const next = postIndex >= 0 ? sortedPosts[postIndex - 1] : undefined

  const authorSlugs = post.authors || ['default']
  const authorDetails = await Promise.all(authorSlugs.map(getAuthorBySlug))

  const mainContent = {
    ...post,
    type: 'Blog' as const,
  }

  const jsonLd = {
    ...post.structuredData,
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name })),
  }

  const Layout = LAYOUTS[post.layout || DEFAULT_LAYOUT]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXRenderer source={post.rawContent || ''} />
      </Layout>
    </>
  )
}
