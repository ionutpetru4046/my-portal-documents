import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.documents.delete({ where: { id } });
    return NextResponse.json({ message: "Document deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete document" }, { status: 500 });
  }
}
