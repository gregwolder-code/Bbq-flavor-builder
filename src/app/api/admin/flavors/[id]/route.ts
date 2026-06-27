import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { flavorProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const [updatedFlavor] = await db
      .update(flavorProfiles)
      .set(body)
      .where(eq(flavorProfiles.id, id))
      .returning();

    if (!updatedFlavor) {
      return NextResponse.json({ error: "Flavor profile not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFlavor);
  } catch (error) {
    console.error("Error updating flavor profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;

    const deleted = await db
      .delete(flavorProfiles)
      .where(eq(flavorProfiles.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Flavor profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flavor profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
