import { genPageMetadata } from 'app/seo'
import { getAllWikis, sortPosts, allCoreContent } from '~/server/content-api'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { WikiList } from '~/components/wiki/wiki-list'

export const revalidate = 5
export const metadata = genPageMetadata({ title: 'Wiki' })

export default async function WikiPage() {
  const data = await getAllWikis()
  const posts = allCoreContent(sortPosts(data))

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Wiki"
        description="You may not be important, but your preferences/likes are important. This is A collection of interesting knowledge and Q&A with AI. Use the search below to filter by title."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <WikiList posts={posts} />
    </Container>
  )
}
