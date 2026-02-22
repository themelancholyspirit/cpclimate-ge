import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'

// GET /api/landmarks/[slug] - Get a single landmark by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const { slug } = params

    const landmark = await prisma.landmark.findUnique({
      where: { slug },
    })

    if (!landmark) {
      return NextResponse.json(
        { error: 'Landmark not found' },
        { status: 404 }
      )
    }

    // Transform image UUID to full Directus asset URL
    const transformedLandmark = {
      ...landmark,
      headerImage: landmark.image 
        ? `${DIRECTUS_URL}/assets/${landmark.image}`
        : null,
    }

    return NextResponse.json(transformedLandmark)
  } catch (error) {
    console.error('Error fetching landmark:', error)
    return NextResponse.json(
      { error: 'Failed to fetch landmark' },
      { status: 500 }
    )
  }
}
