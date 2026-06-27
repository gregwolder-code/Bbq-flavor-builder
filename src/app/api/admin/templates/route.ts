import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { recipeTemplates } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { 
      title, proteinId, cookingMethodId, flavorProfileId, 
      recipeType, ingredients, instructions, 
      prepTime, cookTime, restingTime, targetTempF, 
      woodPairings, sauceRecommendations, sideRecommendations, cookingTips 
    } = body;

    if (!title || !proteinId || !cookingMethodId || !flavorProfileId || !recipeType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [newTemplate] = await db
      .insert(recipeTemplates)
      .values({
        id: crypto.randomUUID(),
        title,
        proteinId,
        cookingMethodId,
        flavorProfileId,
        recipeType,
        ingredients,
        instructions,
        prepTime,
        cookTime,
        restingTime,
        targetTempF,
        woodPairings,
        sauceRecommendations,
        sideRecommendations,
        cookingTips,
      })
      .returning();

    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
