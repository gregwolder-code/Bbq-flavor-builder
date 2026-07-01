import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { savedRecipes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET user's saved recipes
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await db
      .select()
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, session.user.id))
      .orderBy(desc(savedRecipes.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST save a new recipe
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for premium tier to save recipes
    const tier = session.user.premiumTier;
    const isPremium = tier === "premium" || tier === "unlimited" || session.user.isAdmin;
    
    if (!isPremium) {
      return NextResponse.json({ 
        error: "Premium subscription required to save recipes to your book." 
      }, { status: 403 });
    }

    const body = await req.json();
    const { 
      recipeTemplateId, protein, cookingMethod, flavorProfile, 
      recipeType, title, ingredients, instructions, 
      cookTime, targetTempF, woodPairings, 
      sauceRecommendations, sideRecommendations, cookingTips 
    } = body;

    if (!title || !ingredients || !instructions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRecipe = await db.insert(savedRecipes).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      recipeTemplateId,
      protein,
      cookingMethod,
      flavorProfile,
      recipeType,
      title,
      ingredients,
      instructions,
      cookTime,
      targetTempF,
      woodPairings,
      sauceRecommendations,
      sideRecommendations,
      cookingTips,
    }).returning();

    return NextResponse.json(newRecipe[0]);
  } catch (error) {
    console.error("Error saving recipe:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
