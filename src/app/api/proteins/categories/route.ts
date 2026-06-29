import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, proteins } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const cats = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));

    const pros = await db
      .select()
      .from(proteins)
      .where(eq(proteins.isAvailable, true))
      .orderBy(asc(proteins.sortOrder));

    const grouped = cats.map((cat) => ({
      ...cat,
      proteins: pros.filter((p) => p.categoryId === cat.id),
    }));

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Error fetching grouped proteins:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
