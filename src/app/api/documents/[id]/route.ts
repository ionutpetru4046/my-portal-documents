import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } } // Correct typing for App Router
) {
  const { id } = params;

  if (!id) return NextResponse.json({ error: "Document ID is required" }, { status: 400 });

  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Document deleted successfully" });
}
