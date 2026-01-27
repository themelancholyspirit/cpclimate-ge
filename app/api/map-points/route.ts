import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/map-points - Get all map points and verified/resolved reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    // Fetch regular map points
    const where: any = {}
    if (type && type !== 'all') where.type = type
    if (status) where.status = status

    const mapPoints = await prisma.mapPoint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Fetch verified and resolved reports that have coordinates
    const verifiedReports = await prisma.report.findMany({
      where: {
        status: {
          in: ['verified', 'resolved']
        },
        lat: { not: null },
        lng: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform reports to match MapPoint structure
    const reportPoints = verifiedReports.map(report => ({
      id: report.id,
      type: 'pollution', // Map issue types to map point types
      lat: report.lat!,
      lng: report.lng!,
      status: report.status === 'resolved' ? 'normal' : 'warning',
      title: report.issueType.charAt(0).toUpperCase() + report.issueType.slice(1) + ' Issue',
      description: report.description,
      metadata: {
        source: 'report',
        issueType: report.issueType,
        reporterName: report.reporterName,
        reportId: report.id,
      }
    }))

    // Combine both arrays
    const allPoints = [...mapPoints, ...reportPoints]

    return NextResponse.json(allPoints)
  } catch (error) {
    console.error('Error fetching map points:', error)
    return NextResponse.json(
      { error: 'Failed to fetch map points' },
      { status: 500 }
    )
  }
}

// POST /api/map-points - Create a new map point (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, lat, lng, status, title, description, metadata } = body

    // Validate required fields
    if (!type || !lat || !lng || !status || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const mapPoint = await prisma.mapPoint.create({
      data: {
        type,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        status,
        title,
        description,
        metadata,
      },
    })

    return NextResponse.json(mapPoint, { status: 201 })
  } catch (error) {
    console.error('Error creating map point:', error)
    return NextResponse.json(
      { error: 'Failed to create map point' },
      { status: 500 }
    )
  }
}
