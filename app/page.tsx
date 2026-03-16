import { getAllBlogs, getAllSnippets, sortPosts, allCoreContent } from '~/server/content-api'
import { Home } from '~/components/home-page'

export const revalidate = 5

const MAX_POSTS_DISPLAY = 5
const MAX_SNIPPETS_DISPLAY = 6

export default async function HomePage() {
  const [blogs, snippets] = await Promise.all([getAllBlogs(), getAllSnippets()])
  return (
    <Home
      posts={allCoreContent(sortPosts(blogs)).slice(0, MAX_POSTS_DISPLAY)}
      snippets={allCoreContent(sortPosts(snippets)).slice(0, MAX_SNIPPETS_DISPLAY)}
    />
  )
}
