import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/map-points - Get all map points and verified/resolved reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // e.g., "water", "pollution", "report"
    const status = searchParams.get('status') // optional filtering

    // Regular map_points
    const mapPointsWhere: any = {}
    if (type && type !== 'all') mapPointsWhere.type = type
    if (status) mapPointsWhere.status = status

    const mapPoints = await prisma.mapPoint.findMany({
      where: mapPointsWhere,
      orderBy: { createdAt: 'desc' },
    })

    // Include reports that have lat/lng and are verified/resolved
    const reportWhere: any = { lat: { not: null }, lng: { not: null } }
    if (status) reportWhere.status = status
    if (type && type !== 'all') {
      if (type !== 'report') reportWhere.id = undefined // skip if not requesting reports
    }

    const reports = await prisma.report.findMany({
      where: reportWhere,
      orderBy: { createdAt: 'desc' },
    })

    // Map reports into "mapPoints" shape
    const reportMapPoints = reports.map((r) => ({
      id: r.id,
      type: 'report', // unified type
      lat: r.lat!,
      lng: r.lng!,
      status: r.status,
      title: r.reporterName,
      description: r.description,
      createdAt: r.createdAt,
    }))

    const allPoints = [...mapPoints, ...reportMapPoints]

    return NextResponse.json(allPoints)
  } catch (error) {
    console.error('Error fetching map points:', error)
    return NextResponse.json({ error: 'Failed to fetch map points' }, { status: 500 })
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
