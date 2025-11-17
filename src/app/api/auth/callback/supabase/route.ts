import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, name } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing user data" }, { status: 400 });
    }

    // Verify the Supabase session exists
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Return success - the client will handle creating NextAuth session
    // We'll use a workaround: modify the dashboard to accept Supabase sessions
    return NextResponse.json({ success: true, userId, email, name });
  } catch (error) {
    console.error("Supabase callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

