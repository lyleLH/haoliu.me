import { genPageMetadata } from 'app/seo'
import { getAllBlogs, sortPosts, allCoreContent } from '~/server/content-api'
import { ListLayout } from '~/layouts/list-layout'
import { POSTS_PER_PAGE } from '~/utils/const'

export const revalidate = 5
export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage() {
  const blogs = await getAllBlogs()
  const posts = allCoreContent(sortPosts(blogs))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All posts"
    />
  )
}
