import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'

// GET /api/landmarks/featured - Get featured landmarks
export async function GET(request: NextRequest) {
  try {
    const landmarks = await prisma.landmark.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    })

    // Transform image UUIDs to full Directus asset URLs
    const transformedLandmarks = landmarks.map(landmark => ({
      ...landmark,
      headerImage: landmark.image 
        ? `${DIRECTUS_URL}/assets/${landmark.image}`
        : null,
    }))

    return NextResponse.json({ landmarks: transformedLandmarks })
  } catch (error) {
    console.error('Error fetching featured landmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured landmarks' },
      { status: 500 }
    )
  }
}
