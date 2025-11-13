import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const userId =
    session?.user && typeof session.user === "object" && "id" in session.user
      ? session.user.id
      : undefined;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { category, path, size } = body;

    if (!category || !path || !size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("documents")
      .insert([{ userID: userId, category, path, size }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}
