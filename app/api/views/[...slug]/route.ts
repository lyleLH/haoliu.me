import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import __db from '~/server/prisma.server'

type Params = {
  params: {
    slug: string[]
  }
}

const isProduction = process.env.NODE_ENV === 'production'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const slug = params.slug?.pop()?.toString() as string

    const views = await __db.views.findUnique({ where: { slug } })

    return NextResponse.json({
      total: views?.count?.toString?.() || 0,
      slug,
    })
  } catch (e) {
    return NextResponse.json({ message: e.message })
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const slug = params.slug?.pop()?.toString() as string

    // Avoid dirty data in the development environment
    if (!isProduction) {
      return NextResponse.json({ total: '0' })
    }

    const newOrUpdatedViews = await __db.views.upsert({
      where: { slug },
      create: { slug },
      update: { count: { increment: 1 } },
    })

    return NextResponse.json({
      total: newOrUpdatedViews.count.toString(),
      slug,
    })
  } catch (e) {
    return NextResponse.json({ message: e.message })
  }
}
