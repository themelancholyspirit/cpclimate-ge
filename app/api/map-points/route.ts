import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/map-points - Get all map points and verified/resolved reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // "water", "waste", "flooding", etc.

    const where: any = {}
    if (type && type !== 'all') where.type = type  // filter by type if provided

    const mapPoints = await prisma.mapPoint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(mapPoints)
  } catch (error) {
    console.error('Error fetching map points:', error)
    return NextResponse.json({ error: 'Failed to fetch map points' }, { status: 500 })
  }
}

// POST /api/map-points - Create a new map point (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, lat, lng, status, title, description, metadata } = body;

    // Validate required fields
    if (!type || !lat || !lng || !status || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
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
    });

    return NextResponse.json(mapPoint, { status: 201 });
  } catch (error) {
    console.error("Error creating map point:", error);
    return NextResponse.json(
      { error: "Failed to create map point" },
      { status: 500 },
    );
  }
}
