import { mkdirSync, writeFileSync } from 'fs'
import { slug } from 'github-slugger'
import path from 'path'
import mime from 'mime'
import { escape } from 'pliny/utils/htmlEscaper'
import { AUTHOR_INFO } from '~/data/author-info'
import { SITE_METADATA } from '~/data/site-metadata'

const API_BASE =
  process.env.CONTENT_API_URL || 'https://blog-editor-api.v2top1lyle.workers.dev'
const RSS_PAGE = 'feed.xml'

interface RssPost {
  slug: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  images?: string[]
  draft?: boolean
}

async function fetchList(kind: 'blogs' | 'snippets'): Promise<RssPost[]> {
  const res = await fetch(`${API_BASE}/api/content/${kind}`)
  if (!res.ok) throw new Error(`fetch ${kind} failed: ${res.status}`)
  return res.json() as Promise<RssPost[]>
}

function sortByDate(items: RssPost[]): RssPost[] {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function generateRssItem(item: RssPost) {
  const { siteUrl, author } = SITE_METADATA
  const { email } = AUTHOR_INFO
  return `
		<item>
			<guid>${siteUrl}/blog/${item.slug}</guid>
			<title>${escape(item.title)}</title>
			<link>${siteUrl}/blog/${item.slug}</link>
			${item.summary ? `<description>${escape(item.summary)}</description>` : ''}
			<pubDate>${new Date(item.date).toUTCString()}</pubDate>
			<author>${email} (${author})</author>
			${item.tags?.length ? item.tags.map((t) => `<category>${t}</category>`).join('') : ''}
      ${item.images?.length ? item.images.map((i) => `<enclosure url="${siteUrl}${i}" length="0" type="${mime.getType(i)}" />`).join('') : ''}
		</item>
	`
}

function generateRss(items: RssPost[], page = RSS_PAGE) {
  const { title, siteUrl, description, language, author } = SITE_METADATA
  const { email } = AUTHOR_INFO
  return `
		<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
			<channel>
				<title>${escape(title)}</title>
				<link>${siteUrl}/blog</link>
				<description>${escape(description)}</description>
				<language>${language}</language>
				<managingEditor>${email} (${author})</managingEditor>
				<webMaster>${email} (${author})</webMaster>
				<lastBuildDate>${new Date(items[0].date).toUTCString()}</lastBuildDate>
				<atom:link href="${siteUrl}/${page}" rel="self" type="application/rss+xml"/>
				${items.map(generateRssItem).join('')}
			</channel>
		</rss>
	`
}

export async function generateRssFeed() {
  const [blogs, snippets] = await Promise.all([fetchList('blogs'), fetchList('snippets')])
  const publishPosts = blogs.filter((p) => !p.draft)
  const publishSnippets = snippets.filter((p) => !p.draft)

  if (publishPosts.length === 0 && publishSnippets.length === 0) {
    console.log('🗒️. No posts to generate RSS for.')
    return
  }

  const allItems = sortByDate([...publishPosts, ...publishSnippets])
  writeFileSync(`./public/${RSS_PAGE}`, generateRss(allItems))

  const tagSet = new Set<string>()
  for (const item of allItems) {
    for (const t of item.tags || []) tagSet.add(slug(t))
  }
  for (const tag of tagSet) {
    const filtered = allItems.filter((p) => (p.tags || []).map((t) => slug(t)).includes(tag))
    if (filtered.length === 0) continue
    const rssPath = path.join('public', 'tags', tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, RSS_PAGE), generateRss(filtered, `tags/${tag}/feed.xml`))
  }
  console.log('🗒️. RSS feed generated.')
}
