import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId =
    session?.user && typeof session.user === "object" && "id" in session.user
      ? session.user.id
      : undefined;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", params.id)
    .eq("userID", userId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId =
    session?.user && typeof session.user === "object" && "id" in session.user
      ? session.user.id
      : undefined;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", params.id)
    .eq("userID", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: `Document ${params.id} deleted.` });
}
