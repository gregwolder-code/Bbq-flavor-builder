import { NextResponse } from "next/server";
import { db } from "@/db";
import { proteins } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(proteins)
      .where(eq(proteins.isAvailable, true))
      .orderBy(asc(proteins.sortOrder));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching proteins:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
