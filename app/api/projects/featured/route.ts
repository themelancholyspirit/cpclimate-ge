import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

export async function GET() {
  try {
    const featuredProjects = await prisma.project.findMany({
      where: {
        featured: true,
        status: "Active",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    // Transform headerImage UUIDs to full Directus asset URLs
    const transformedProjects = featuredProjects.map((project) => ({
      ...project,
      headerImage: project.headerImage
        ? `${DIRECTUS_URL}/assets/${project.headerImage}`
        : null,
    }));

    return NextResponse.json({ projects: transformedProjects });
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
      { status: 500 }
    );
  }
}
