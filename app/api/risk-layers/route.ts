import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/risk-layers - Get risk layer overlays with optional filters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const riskType = searchParams.get('riskType')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (riskType) where.riskType = riskType
    if (isActive !== null && isActive !== undefined) where.isActive = isActive === 'true'

    const layers = await prisma.riskLayer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(layers)
  } catch (error) {
    console.error('Error fetching risk layers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch risk layers' },
      { status: 500 }
    )
  }
}
