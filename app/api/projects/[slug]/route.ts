import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'

// GET /api/projects/[slug] - Get a specific project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const project = await prisma.project.findUnique({
      where: { slug },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Transform headerImage UUID to full Directus asset URL
    const transformedProject = {
      ...project,
      headerImage: project.headerImage 
        ? `${DIRECTUS_URL}/assets/${project.headerImage}`
        : null,
    }

    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
