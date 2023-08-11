import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST() {
  const prisma = new PrismaClient();
  const deleteSessions = await prisma.session.deleteMany({})
  const deleteTasks = await prisma.task.deleteMany({})

  if (deleteSessions && deleteTasks) {
    return NextResponse.json({ message: 'Delete success' });
  } else {
    return NextResponse.json({ message: 'Delete failed' });
  }
}