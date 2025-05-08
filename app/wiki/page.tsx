import { genPageMetadata } from 'app/seo'
import { allWikis } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { WikiList } from '~/components/wiki/wiki-list'

export const metadata = genPageMetadata({ title: 'Wiki' })

export default function WikiPage() {
  const posts = allCoreContent(sortPosts(allWikis))

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
