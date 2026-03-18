import { genPageMetadata } from 'app/seo'
import { getAllMoments, getMomentsMeta } from '~/server/content-api'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { MomentsTimeline } from '~/components/moments/timeline'

export const revalidate = 5
export const metadata = genPageMetadata({
  title: 'Moments',
  description: 'Short thoughts, photos, bookmarks, and updates.',
})

export default async function MomentsPage() {
  const [{ entries, hasMore }, meta] = await Promise.all([getAllMoments(), getMomentsMeta()])

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Moments"
        description="Short thoughts, photos, bookmarks, and updates."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="min-h-[60vh] py-8">
        <MomentsTimeline
          initialEntries={entries}
          initialHasMore={hasMore}
          activeDates={meta.dates}
          allTags={meta.tags}
        />
      </div>
    </Container>
  )
}
