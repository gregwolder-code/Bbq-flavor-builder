import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { savedRecipes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET a specific saved recipe
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [recipe] = await db
      .select()
      .from(savedRecipes)
      .where(
        and(
          eq(savedRecipes.id, id),
          eq(savedRecipes.userId, session.user.id)
        )
      )
      .limit(1);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT update a specific saved recipe
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const [updatedRecipe] = await db
      .update(savedRecipes)
      .set({
        ...body,
        updatedAt: undefined,
      })
      .where(
        and(
          eq(savedRecipes.id, id),
          eq(savedRecipes.userId, session.user.id)
        )
      )
      .returning();

    if (!updatedRecipe) {
      return NextResponse.json({ error: "Recipe not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a specific saved recipe
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deleted = await db
      .delete(savedRecipes)
      .where(
        and(
          eq(savedRecipes.id, id),
          eq(savedRecipes.userId, session.user.id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Recipe not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
