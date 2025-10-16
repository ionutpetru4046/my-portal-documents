// src/app/api/documents/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path if needed

interface DocumentType {
  id: number;
  name: string;
  createdAt: string;
  ownerEmail: string;
}

// Mock database
let mockDocuments: DocumentType[] = [
  { id: 1, name: "Document 1", createdAt: new Date().toISOString(), ownerEmail: "user1@gmail.com" },
  { id: 2, name: "Document 2", createdAt: new Date().toISOString(), ownerEmail: "user2@gmail.com" },
];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Filter documents for the logged-in user
  const userDocs = mockDocuments.filter(doc => doc.ownerEmail === session.user?.email);

  return NextResponse.json({ documents: userDocs });
}
