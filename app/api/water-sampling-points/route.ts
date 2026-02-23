import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/water-sampling-points - Get water quality testing points
export async function GET(request: NextRequest) {
  try {
    const points = await prisma.waterSamplingPoint.findMany({
      orderBy: { testDate: 'desc' },
    })

    return NextResponse.json(points)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch water sampling points' },
      { status: 500 }
    )
  }
}
