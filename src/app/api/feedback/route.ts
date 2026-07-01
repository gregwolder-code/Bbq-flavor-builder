import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, email } = await req.json();
    if (!message || typeof message !== "string" || message.trim().length === 0)
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    console.log("📬 Feedback:", { message: message.substring(0, 500), email: email || "anonymous", time: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
