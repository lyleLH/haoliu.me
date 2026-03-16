import { getAuthorBySlug } from '~/server/content-api'
import { MDXRenderer } from '~/components/mdx/mdx-renderer'
import { AuthorLayout } from '~/layouts/author-layout'
import { genPageMetadata } from 'app/seo'
import { SocialAccounts } from '~/components/author/social-accounts'
import { SupportMe } from '~/components/author/support-me'
import { Twemoji } from '~/components/ui/twemoji'

export const revalidate = 5
export const metadata = genPageMetadata({ title: 'About' })

export default async function AboutPage() {
  const author = await getAuthorBySlug('default')

  return (
    <AuthorLayout content={author}>
      <MDXRenderer
        source={author.rawContent || ''}
        components={{ SocialAccounts, SupportMe, Twemoji }}
      />
    </AuthorLayout>
  )
}
