import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession, NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as unknown as NextAuthOptions);

  // Attempt to get githubId from session for user identification
  // Fallback to email if githubId is not available
  const userId =
    (session?.user as { githubId?: string })?.githubId ||
    session?.user?.email;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(`${userId}/${file.name}`, file.stream());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add record in documents table
  const { data: docData, error: dbError } = await supabase
    .from("documents")
    .insert([
      {
        userID: userId,
        path: data.path,
        size: file.size,
        category: (formData.get("category") as string) || "other",
      }
    ]);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  if (!docData || !docData[0]) {
    return NextResponse.json({ error: "Unable to retrieve inserted document." }, { status: 500 });
  }

  return NextResponse.json(docData[0]);
}
