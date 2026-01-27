import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/media - Get all media items
export async function GET(request: NextRequest) {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(mediaItems)
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
