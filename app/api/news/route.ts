import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/news - Get all news/media items
export async function GET(request: NextRequest) {
  try {
    const newsItems = await prisma.mediaItem.findMany({
      orderBy: { date: 'desc' },
    })

    // Transform the response to include the full Directus image URL if image exists
    const transformedItems = newsItems.map(item => ({
      id: item.id,
      slug: item.slug,
      title_en: item.title_en,
      title_ka: item.title_ka,
      excerpt_en: item.description_en,
      excerpt_ka: item.description_ka,
      content_en: item.content_en,
      content_ka: item.content_ka,
      publishedAt: item.date.toISOString(),
      headerImage: item.image
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'}/assets/${item.image}`
        : null,
      category: item.type,
    }))

    return NextResponse.json({ news: transformedItems })
  } catch (error) {
    console.error('Error fetching news items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news items' },
      { status: 500 }
    )
  }
}
