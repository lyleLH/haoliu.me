import { genPageMetadata } from 'app/seo'
import { getAllSnippets, sortPosts, allCoreContent } from '~/server/content-api'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { SnippetCard } from '~/components/cards/snippet'

export const revalidate = 5
export const metadata = genPageMetadata({ title: 'Snippets' })

export default async function Snippets() {
  const data = await getAllSnippets()
  const snippets = allCoreContent(sortPosts(data))

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Snippets"
        description="My personal stash of code snippets that make my life easier. They're simple and reusable. Feel free to copy, tweak, and use them as you like."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-10">
        <div className="grid-cols-2 gap-x-6 gap-y-10 space-y-10 md:grid md:space-y-0">
          {snippets.map((snippet) => (
            <SnippetCard snippet={snippet} key={snippet.path} />
          ))}
        </div>
      </div>
    </Container>
  )
}
