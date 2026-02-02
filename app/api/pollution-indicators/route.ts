import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/pollution-indicators - Get pollution indicators with optional filters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const indicatorType = searchParams.get('indicatorType')
    const sourceType = searchParams.get('sourceType')

    const where: any = {}
    if (indicatorType) where.indicatorType = indicatorType
    if (sourceType) where.sourceType = sourceType

    const indicators = await prisma.pollutionIndicator.findMany({
      where,
      orderBy: { reportedAt: 'desc' },
    })

    return NextResponse.json(indicators)
  } catch (error) {
    console.error('Error fetching pollution indicators:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pollution indicators' },
      { status: 500 }
    )
  }
}
