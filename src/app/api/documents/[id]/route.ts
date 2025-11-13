import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Example: delete the document by id
    // await deleteDocument(id); // your actual delete logic

    return NextResponse.json({ message: `Document ${id} deleted.` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
