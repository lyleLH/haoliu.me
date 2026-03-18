'use client'

import { KBarSearchProvider } from 'pliny/search/KBar'
import { useRouter } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { SITE_METADATA } from '~/data/site-metadata'

interface SearchDoc {
  path: string
  title: string
  date: string
  summary?: string
  type: string
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const onSearchDocumentsLoad = (docs: SearchDoc[]) => {
    return docs.map((doc) => {
      const isMoment = doc.type.startsWith('moment:')
      const typeLabel = isMoment ? doc.type.replace('moment:', '') : undefined

      let sectionLabel = 'Blog'
      if (isMoment) sectionLabel = `Moment · ${typeLabel}`
      else if (doc.type === 'snippet') sectionLabel = 'Snippet'
      else if (doc.type === 'wiki') sectionLabel = 'Wiki'

      return {
        id: doc.path,
        name: doc.title,
        keywords: doc.summary || '',
        section: 'Content',
        subtitle: `${formatDate(doc.date, 'en-US')} · ${sectionLabel}`,
        perform: () => router.push('/' + doc.path),
      }
    })
  }

  return (
    <KBarSearchProvider
      kbarConfig={{
        searchDocumentsPath: SITE_METADATA.search.kbarConfig.searchDocumentsPath,
        onSearchDocumentsLoad,
      }}
    >
      {children}
    </KBarSearchProvider>
  )
}
