import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;
  const prisma = new PrismaClient();
  const task = await prisma.task.findFirst({
    include: {
      sessions: true,
    },
    where: {
      id: taskId,
      sessions: {
        some: {},
      },
    },
  });
  return NextResponse.json({ data: task });
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;
  const prisma = new PrismaClient();
  const deleteSessions = prisma.session.deleteMany({
    where: {
      taskId: taskId,
    },
  });
  const deleteTask = prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  const transaction = await prisma.$transaction([deleteSessions, deleteTask]);

  return NextResponse.json({});
}
