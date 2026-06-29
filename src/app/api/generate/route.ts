import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { proteins, cookingMethods, flavorProfiles, recipeTemplates } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { proteinSlug, methodSlug, flavorSlug } = await req.json();

    if (!proteinSlug || !methodSlug || !flavorSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Get IDs for slugs
    const [protein] = await db.select().from(proteins).where(eq(proteins.slug, proteinSlug)).limit(1);
    const [method] = await db.select().from(cookingMethods).where(eq(cookingMethods.slug, methodSlug)).limit(1);
    const [flavor] = await db.select().from(flavorProfiles).where(eq(flavorProfiles.slug, flavorSlug)).limit(1);

    if (!protein || !method || !flavor) {
      return NextResponse.json({ error: "Invalid protein, method, or flavor slug" }, { status: 404 });
    }

    // 2. Try to find exact matches for all 3 recipe types
    const types = ["dry_rub", "marinade", "brine"] as const;
    const results: Record<string, any> = {};

    for (const type of types) {
      let matchType: "exact" | "protein_flavor" | "protein_only" | "none" = "exact";
      
      // Try exact match: protein + method + flavor
      let [template] = await db
        .select()
        .from(recipeTemplates)
        .where(
          and(
            eq(recipeTemplates.proteinId, protein.id),
            eq(recipeTemplates.cookingMethodId, method.id),
            eq(recipeTemplates.flavorProfileId, flavor.id),
            eq(recipeTemplates.recipeType, type)
          )
        )
        .limit(1);

      // Fallback 1: protein + flavor (any method)
      if (!template) {
        matchType = "protein_flavor";
        [template] = await db
          .select()
          .from(recipeTemplates)
          .where(
            and(
              eq(recipeTemplates.proteinId, protein.id),
              eq(recipeTemplates.flavorProfileId, flavor.id),
              eq(recipeTemplates.recipeType, type)
            )
          )
          .limit(1);
      }

      // Fallback 2: protein only (any flavor, any method) - get first available for this type
      if (!template) {
        matchType = "protein_only";
        [template] = await db
          .select()
          .from(recipeTemplates)
          .where(
            and(
              eq(recipeTemplates.proteinId, protein.id),
              eq(recipeTemplates.recipeType, type)
            )
          )
          .limit(1);
      }

      if (template) {
        results[type] = {
          ...template,
          matchType
        };
      }
    }

    return NextResponse.json({
      protein,
      method,
      flavor,
      recipes: results
    });

  } catch (error) {
    console.error("Error generating recipes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
