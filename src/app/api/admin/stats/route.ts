import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { proteins, cookingMethods, flavorProfiles, recipeTemplates, savedRecipes, users } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    // Get basic counts
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [proteinCount] = await db.select({ count: sql<number>`count(*)` }).from(proteins);
    const [methodCount] = await db.select({ count: sql<number>`count(*)` }).from(cookingMethods);
    const [flavorCount] = await db.select({ count: sql<number>`count(*)` }).from(flavorProfiles);
    const [templateCount] = await db.select({ count: sql<number>`count(*)` }).from(recipeTemplates);
    const [savedCount] = await db.select({ count: sql<number>`count(*)` }).from(savedRecipes);

    return NextResponse.json({
      counts: {
        users: userCount.count,
        proteins: proteinCount.count,
        methods: methodCount.count,
        flavors: flavorCount.count,
        templates: templateCount.count,
        savedRecipes: savedCount.count,
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
