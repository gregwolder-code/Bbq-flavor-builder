import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { proteins } from "@/db/schema";
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

    const [updatedProtein] = await db
      .update(proteins)
      .set(body)
      .where(eq(proteins.id, id))
      .returning();

    if (!updatedProtein) {
      return NextResponse.json({ error: "Protein not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProtein);
  } catch (error) {
    console.error("Error updating protein:", error);
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
      .delete(proteins)
      .where(eq(proteins.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Protein not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting protein:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
