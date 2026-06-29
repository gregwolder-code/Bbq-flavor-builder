import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, email } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // In a real app, we would save this to a database or send an email.
    // For now, we'll just log it and return success.
    console.log(`[FEEDBACK] from ${email || "anonymous"}: ${message}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
