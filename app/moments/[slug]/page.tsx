import { genPageMetadata } from 'app/seo'
import { getMomentBySlug } from '~/server/content-api'
import { Container } from '~/components/ui/container'
import { Link } from '~/components/ui/link'
import { MomentDetail } from '~/components/moments/detail'
import { ArrowLeft } from 'lucide-react'
import { GrowingUnderline } from '~/components/ui/growing-underline'

export const revalidate = 5

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const moment = await getMomentBySlug(params.slug)
  const title = moment.content?.slice(0, 60) || 'Moment'
  return genPageMetadata({ title, description: moment.content || '' })
}

export default async function MomentPage({ params }: { params: { slug: string } }) {
  const moment = await getMomentBySlug(params.slug)

  return (
    <Container className="pt-4 lg:pt-12">
      <div className="mb-6">
        <Link href="/moments" className="inline-flex items-center gap-1 text-sm text-gray-500 no-underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft size={14} />
          <GrowingUnderline>Back to Moments</GrowingUnderline>
        </Link>
      </div>
      <div className="mx-auto max-w-2xl">
        <MomentDetail entry={moment} />
      </div>
    </Container>
  )
}
