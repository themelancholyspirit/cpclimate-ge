import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/resources - Get all resources with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");

    const where: any = {};
    if (category && category !== "all") where.category = category;
    if (type) where.type = type;

    const resources = await prisma.resource.findMany({
      where,
      orderBy: { date: "desc" },
    });

    // Transform file (UUID) to full Directus file URL
    const transformedResources = resources.map((resource) => ({
      ...resource,
      fileUrl: resource.file
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${resource.file}`
        : null,
    }));

    return NextResponse.json(transformedResources);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 },
    );
  }
}

// POST /api/resources - Create a new resource (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      type,
      date,
      description,
      pages,
      category,
      file,
      externalUrl,
    } = body;

    if (!title || !type || !date || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        type,
        date: new Date(date),
        description,
        pages: pages ? parseInt(pages) : null,
        category,
        file,
        externalUrl,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 },
    );
  }
}
