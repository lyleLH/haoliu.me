const API_BASE = process.env.CONTENT_API_URL || 'http://localhost:8788'

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api/content${path}`, {
    next: { revalidate: 5 },
  } as RequestInit)
  if (!res.ok) throw new Error(`Content API error: ${res.status} ${path}`)
  return res.json() as Promise<T>
}

function normalizePost(p: Partial<ContentPost>): ContentPost {
  const rt = p.readingTime || { text: '1 min read', minutes: 1, words: 0, time: 60000 }
  const toc = (p.toc || []).map((t) => ({
    depth: t.depth,
    value: t.value,
    url: t.url || `#${t.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  }))
  return {
    ...p,
    toc,
    filePath: p.filePath || `data/${p.type || 'blog'}/${p.slug}.mdx`,
    readingTime: { ...rt, time: rt.time || rt.minutes * 60000 },
  } as ContentPost
}

function normalizeAuthor(a: Partial<ContentAuthor>): ContentAuthor {
  return {
    toc: [],
    readingTime: { text: '', minutes: 0, words: 0 },
    type: 'Author',
    path: `authors/${a.slug}`,
    filePath: `data/authors/${a.slug}.mdx`,
    ...a,
  } as ContentAuthor
}

// --- Types ---

export interface ContentPost {
  slug: string
  path: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  summary: string
  images: string[]
  authors: string[]
  readingTime: { text: string; minutes: number; words: number; time: number }
  layout?: string
  lastmod?: string
  structuredData: Record<string, unknown>
  type: string
  toc: { depth: number; value: string; url: string }[]
  filePath: string
  rawContent?: string
  compiledContent?: string | null
  // Snippet-specific
  heading?: string
  icon?: string
  // Wiki-specific
  link?: string
}

export interface ContentAuthor {
  slug: string
  name: string
  avatar: string | null
  occupation: string | null
  company: string | null
  email: string | null
  twitter: string | null
  linkedin: string | null
  github: string | null
  layout: string | null
  rawContent: string | null
  compiledContent: string | null
  // Fields expected by layouts (compatibility)
  toc: { depth: number; value: string; url: string }[]
  readingTime: { text: string; minutes: number; words: number; time: number }
  type: string
  path: string
  filePath: string
}

// --- Blog ---

export async function getAllBlogs(): Promise<ContentPost[]> {
  const data = await fetchAPI<Partial<ContentPost>[]>('/blogs')
  return data.map(normalizePost)
}

export async function getAllBlogsIncludingDrafts(): Promise<ContentPost[]> {
  const data = await fetchAPI<Partial<ContentPost>[]>('/blogs/all')
  return data.map(normalizePost)
}

export async function getBlogBySlug(slug: string): Promise<ContentPost> {
  const data = await fetchAPI<Partial<ContentPost>>(`/blog/${slug}`)
  return normalizePost(data)
}

// --- Snippets ---

export async function getAllSnippets(): Promise<ContentPost[]> {
  const data = await fetchAPI<Partial<ContentPost>[]>('/snippets')
  return data.map(normalizePost)
}

export async function getSnippetBySlug(slug: string): Promise<ContentPost> {
  const data = await fetchAPI<Partial<ContentPost>>(`/snippet/${slug}`)
  return normalizePost(data)
}

// --- Wiki ---

export async function getAllWikis(): Promise<ContentPost[]> {
  const data = await fetchAPI<Partial<ContentPost>[]>('/wikis')
  return data.map(normalizePost)
}

export async function getWikiBySlug(slug: string): Promise<ContentPost> {
  const data = await fetchAPI<Partial<ContentPost>>(`/wiki/${slug}`)
  return normalizePost(data)
}

// --- Authors ---

export async function getAllAuthors(): Promise<ContentAuthor[]> {
  const data = await fetchAPI<Partial<ContentAuthor>[]>('/authors')
  return data.map(normalizeAuthor)
}

export async function getAuthorBySlug(slug: string): Promise<ContentAuthor> {
  const data = await fetchAPI<Partial<ContentAuthor>>(`/author/${slug}`)
  return normalizeAuthor(data)
}

// --- Tags ---

export async function getTagCounts(): Promise<Record<string, number>> {
  return fetchAPI<Record<string, number>>('/tags')
}

// --- Search ---

export async function getSearchIndex(): Promise<ContentPost[]> {
  return fetchAPI<ContentPost[]>('/search')
}

// --- Moments ---

export interface MomentEntry {
  slug: string
  type: 'text' | 'photo' | 'bookmark' | 'tweet' | 'youtube' | 'github'
  content: string | null
  media: Array<{ type: string; url: string; width?: number; height?: number }>
  bookmark: { url: string; title: string; description: string; image: string | null; embedId?: string | null } | null
  tags: string[]
  createdAt: string
}

export interface MomentsMeta {
  dates: string[]
  tags: Record<string, number>
}

export async function getAllMoments(
  page = 1,
  limit = 20,
  filters?: { date?: string; tag?: string; q?: string }
): Promise<{ entries: MomentEntry[]; hasMore: boolean }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (filters?.date) params.set('date', filters.date)
  if (filters?.tag) params.set('tag', filters.tag)
  if (filters?.q) params.set('q', filters.q)
  return fetchAPI<{ entries: MomentEntry[]; hasMore: boolean }>(`/moments?${params}`)
}

export async function getMomentsMeta(): Promise<MomentsMeta> {
  return fetchAPI<MomentsMeta>('/moments/meta')
}

export async function getMomentBySlug(slug: string): Promise<MomentEntry> {
  return fetchAPI<MomentEntry>(`/moment/${slug}`)
}

// --- Helpers (replace pliny/utils/contentlayer) ---

export function sortPosts(posts: ContentPost[]): ContentPost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function allCoreContent(posts: ContentPost[]): ContentPost[] {
  const isProduction = process.env.NODE_ENV === 'production'
  return posts.filter((p) => !isProduction || !p.draft)
}
