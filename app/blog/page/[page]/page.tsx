import { getAllBlogs, sortPosts, allCoreContent } from '~/server/content-api'
import { ListLayout } from '~/layouts/list-layout'
import { POSTS_PER_PAGE } from '~/utils/const'

export const revalidate = 5

export default async function Page({ params }: { params: { page: string } }) {
  const blogs = await getAllBlogs()
  const posts = allCoreContent(sortPosts(blogs))
  const pageNumber = parseInt(params.page as string)
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
