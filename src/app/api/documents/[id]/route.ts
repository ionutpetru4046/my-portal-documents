import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .eq("userID", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Document ${id} deleted.` });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
