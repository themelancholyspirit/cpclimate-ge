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

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
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
      fileUrl,
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
        fileUrl,
        externalUrl,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 },
    );
  }
}
