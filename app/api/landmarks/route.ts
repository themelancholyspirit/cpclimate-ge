import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'

// GET /api/landmarks - Get all landmarks
export async function GET(request: NextRequest) {
  try {
    const landmarks = await prisma.landmark.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Transform image UUIDs to full Directus asset URLs
    const transformedLandmarks = landmarks.map(landmark => ({
      ...landmark,
      headerImage: landmark.image 
        ? `${DIRECTUS_URL}/assets/${landmark.image}`
        : null,
    }))

    return NextResponse.json(transformedLandmarks)
  } catch (error) {
    console.error('Error fetching landmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch landmarks' },
      { status: 500 }
    )
  }
}

// POST /api/landmarks - Create a new landmark (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title_en, title_ka, description_en, description_ka, content_en, content_ka, location, image, date } = body

    if (!title_en || !title_ka) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const landmark = await prisma.landmark.create({
      data: {
        slug,
        title_en,
        title_ka,
        description_en,
        description_ka,
        content_en,
        content_ka,
        location,
        image,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(landmark, { status: 201 })
  } catch (error) {
    console.error('Error creating landmark:', error)
    return NextResponse.json(
      { error: 'Failed to create landmark' },
      { status: 500 }
    )
  }
}
