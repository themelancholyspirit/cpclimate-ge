import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/media/[slug] - Get a single media item by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const mediaItem = await prisma.mediaItem.findUnique({
      where: { slug },
    })

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      )
    }

    // Transform the response to include the full Directus image URL if image exists
    const transformedItem = {
      ...mediaItem,
      imageUrl: mediaItem.image
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'}/assets/${mediaItem.image}`
        : null,
    }

    return NextResponse.json(transformedItem)
  } catch (error) {
    console.error('Error fetching media item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news article' },
      { status: 500 }
    )
  }
}
