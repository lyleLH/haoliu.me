import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDX_COMPONENTS } from '~/components/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypePrismPlus from 'rehype-prism-plus'
import type { MDXComponents } from 'mdx/types'

interface MDXRendererProps {
  source: string
  components?: MDXComponents
}

export function MDXRenderer({ source, components }: MDXRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={{ ...MDX_COMPONENTS, ...components }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
          ],
        },
      }}
    />
  )
}
