import type { MetadataRoute } from 'next'
import { getAllBlogs, getAllSnippets } from '~/server/content-api'
import { SITE_METADATA } from '~/data/site-metadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_METADATA.siteUrl
  const [blogs, snippets] = await Promise.all([getAllBlogs(), getAllSnippets()])

  const blogRoutes = blogs
    .filter((p) => !p.draft)
    .map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.lastmod || p.date,
    }))
  const snippetRoutes = snippets
    .filter((s) => !s.draft)
    .map((s) => ({
      url: `${siteUrl}/snippets/${s.slug}`,
      lastModified: s.lastmod || s.date,
    }))

  const routes = ['', 'blog', 'snippets', 'projects', 'about', 'books', 'movies', 'tags'].map(
    (route) => ({
      url: `${siteUrl}/${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })
  )

  return [...routes, ...blogRoutes, ...snippetRoutes]
}
