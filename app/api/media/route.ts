import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/media - Get all media items
export async function GET(request: NextRequest) {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      orderBy: { date: 'desc' },
    })

    // Transform the response to include the full Directus image URL if image exists
    const transformedItems = mediaItems.map(item => ({
      ...item,
      imageUrl: item.image
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'}/assets/${item.image}`
        : null,
    }))

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error('Error fetching media items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media items' },
      { status: 500 }
    )
  }
}

// POST /api/media - Create a new media item (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, outlet, date, type, url } = body

    if (!title || !outlet || !date || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const mediaItem = await prisma.mediaItem.create({
      data: {
        title,
        outlet,
        date: new Date(date),
        type,
        url,
      },
    })

    return NextResponse.json(mediaItem, { status: 201 })
  } catch (error) {
    console.error('Error creating media item:', error)
    return NextResponse.json(
      { error: 'Failed to create media item' },
      { status: 500 }
    )
  }
}
