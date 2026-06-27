import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { proteins } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, icon, description, sortOrder } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const [newProtein] = await db
      .insert(proteins)
      .values({
        id: crypto.randomUUID(),
        name,
        slug,
        icon,
        description,
        sortOrder: sortOrder || 0,
      })
      .returning();

    return NextResponse.json(newProtein);
  } catch (error) {
    console.error("Error creating protein:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
