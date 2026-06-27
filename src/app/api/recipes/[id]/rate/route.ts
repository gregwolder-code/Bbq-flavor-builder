import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { recipeRatings, savedRecipes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // savedRecipeId
    const { rating, review } = await req.json();

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating (1-5)" }, { status: 400 });
    }

    // Check if recipe exists and belongs to user
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

    // Insert or update rating
    const [upsertedRating] = await db
      .insert(recipeRatings)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        savedRecipeId: id,
        rating,
        review,
      })
      .onConflictDoUpdate({
        target: [recipeRatings.userId, recipeRatings.savedRecipeId],
        set: { rating, review },
      })
      .returning();

    // Also update the rating on the saved recipe for quick access
    await db
      .update(savedRecipes)
      .set({ rating })
      .where(eq(savedRecipes.id, id));

    return NextResponse.json(upsertedRating);
  } catch (error) {
    console.error("Error rating recipe:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
