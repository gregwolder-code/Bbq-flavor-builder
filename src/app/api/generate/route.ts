import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { proteins, cookingMethods, flavorProfiles, recipeTemplates } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { proteinSlug, methodSlug, flavorSlug, timeSlug } = await req.json();

    if (!proteinSlug || !methodSlug || !flavorSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const time = timeSlug || "standard";

    // 1. Get IDs for slugs
    const [protein] = await db.select().from(proteins).where(eq(proteins.slug, proteinSlug)).limit(1);
    const [method] = await db.select().from(cookingMethods).where(eq(cookingMethods.slug, methodSlug)).limit(1);
    const [flavor] = await db.select().from(flavorProfiles).where(eq(flavorProfiles.slug, flavorSlug)).limit(1);

    if (!protein || !method || !flavor) {
      return NextResponse.json({ error: "Invalid protein, method, or flavor slug" }, { status: 404 });
    }

    // 2. Determine which recipe types to fetch based on protein and time
    const getRecipeTypes = (pSlug: string, tSlug: string): string[] => {
      // Logic from lead instructions:
      // Quick (< 1h): dry_rub + glaze/compound_butter/sauce (NO marinade/brine)
      // Standard (1-3h): dry_rub + marinade
      // Weekend (3-6h): dry_rub + marinade + brine
      // Low & Slow (6h+): dry_rub + marinade + brine

      if (tSlug === "quick") {
        switch (pSlug) {
          case "steak":
            return ["dry_rub", "compound_butter", "sauce"];
          case "chicken":
          case "turkey":
            return ["dry_rub", "glaze"];
          case "salmon":
          case "shrimp":
          case "mixed-veggies":
            return ["marinade", "glaze"]; // Seafood/Veg marinades are fast
          case "burgers":
            return ["dry_rub", "sauce"];
          default:
            return ["dry_rub", "sauce"];
        }
      }

      if (tSlug === "standard") {
        switch (pSlug) {
          case "steak":
            return ["dry_rub", "compound_butter", "sauce"];
          case "salmon":
          case "shrimp":
          case "mixed-veggies":
            return ["marinade", "glaze"];
          case "burgers":
            return ["dry_rub", "sauce"];
          case "chicken":
          case "turkey":
            return ["dry_rub", "marinade"]; // Brine takes too long for standard
          default:
            return ["dry_rub", "marinade"];
        }
      }

      // Weekend (3-6h) or Low & Slow (6h+)
      switch (pSlug) {
        case "brisket":
          return ["dry_rub", "marinade"]; // Brisket usually injection (marinade) + rub
        case "steak":
          return ["dry_rub", "compound_butter", "sauce"];
        case "chicken":
        case "turkey":
          return ["dry_rub", "brine", "glaze"];
        case "salmon":
        case "shrimp":
        case "mixed-veggies":
          return ["marinade", "glaze"];
        case "burgers":
          return ["dry_rub", "sauce"];
        default:
          return ["dry_rub", "marinade", "brine"];
      }
    };

    const types = getRecipeTypes(proteinSlug, time);
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
