import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reports - Get all reports with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const issueType = searchParams.get('issueType')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (status) where.status = status
    if (issueType) where.issueType = issueType

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// POST /api/reports - Submit a new citizen report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received report data:', body)
    
    const {
      issueType,
      location,
      description,
      photos,
      reporterName,
      reporterEmail,
      reporterPhone,
    } = body

    // Validate required fields
    if (!issueType || !location || !description || !reporterName || !reporterEmail) {
      console.error('Missing required fields:', { issueType, location, description, reporterName, reporterEmail })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Filter out empty photo objects and only keep valid file IDs
    const validPhotos = Array.isArray(photos) 
      ? photos.filter(p => p && typeof p === 'string' && p.length > 0)
      : [];

    // Create the report
    const report = await prisma.report.create({
      data: {
        issueType,
        location,
        description,
        photos: validPhotos,
        reporterName,
        reporterEmail,
        reporterPhone: reporterPhone || null,
        status: 'pending',
      },
    })

    console.log('Report created successfully:', report.id)

    // Populate junction table if photos exist
    if (validPhotos.length > 0) {
      try {
        const values = validPhotos.map(photoId => `('${report.id}', '${photoId}')`).join(', ');
        await prisma.$executeRawUnsafe(`
          INSERT INTO reports_files (reports_id, directus_files_id)
          VALUES ${values}
        `);
        console.log(`Linked ${validPhotos.length} photos to report ${report.id}`);
      } catch (junctionError) {
        console.error('Error populating junction table:', junctionError);
        // Don't fail the entire request if junction table fails
      }
    }

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to reporter

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}
