import type { Author, Wiki } from 'contentlayer/generated'
import { allAuthors, allWikis } from 'contentlayer/generated'
import 'css/prism.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { allCoreContent, coreContent, sortPosts } from 'pliny/utils/contentlayer'
import { MDX_COMPONENTS } from '~/components/mdx'
import { SITE_METADATA } from '~/data/site-metadata'
import { PostBanner } from '~/layouts/post-banner'
import { PostLayout } from '~/layouts/post-layout'
import { PostSimple } from '~/layouts/post-simple'

const DEFAULT_LAYOUT = 'PostLayout'
const LAYOUTS = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const wiki = allWikis.find((w) => w.slug === slug)
  const authorList = wiki?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Author)
  })
  if (!wiki) {
    return
  }

  const publishedAt = new Date(wiki.date).toISOString()
  const modifiedAt = new Date(wiki.lastmod || wiki.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [SITE_METADATA.socialBanner]
  if (wiki.images) {
    imageList = typeof wiki.images === 'string' ? [wiki.images] : wiki.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
    }
  })

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
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allWikis))
  const wikiIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (wikiIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[wikiIndex + 1]
  const next = sortedCoreContents[wikiIndex - 1]
  const wiki = allWikis.find((p) => p.slug === slug) as Wiki
  const authorList = wiki?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Author)
  })
  const mainContent = coreContent(wiki)
  const jsonLd = wiki.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = LAYOUTS[wiki.layout || DEFAULT_LAYOUT]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={wiki.body.code} components={MDX_COMPONENTS} toc={wiki.toc} />
      </Layout>
    </>
  )
}
