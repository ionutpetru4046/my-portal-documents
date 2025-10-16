// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path if needed

interface DocumentType {
  id: number;
  name: string;
  createdAt: string;
  ownerEmail: string;
}

// Use the same mock database from /documents
let mockDocuments: DocumentType[] = [
  { id: 1, name: "Document 1", createdAt: new Date().toISOString(), ownerEmail: "user1@gmail.com" },
  { id: 2, name: "Document 2", createdAt: new Date().toISOString(), ownerEmail: "user2@gmail.com" },
];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Save file to mock DB
  const newDoc: DocumentType = {
    id: mockDocuments.length + 1,
    name: file.name,
    createdAt: new Date().toISOString(),
    ownerEmail: session.user?.email || "",
  };

  mockDocuments.push(newDoc);

  return NextResponse.json({ success: true, document: newDoc });
}
