import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

type Timestamp = {
  id: number;
  startTime: Number;
  endTime: Number;
  secondsElapsed: number;
};

export async function GET(req: Request) {
  const prisma = new PrismaClient();
  const allTask = await prisma.task.findMany({
    include: {
      sessions: true
    },
    where: {
      user: {
        username: 'Ranjabi'
      },
      sessions: {
        some: {}
      }
    }
  })

  return NextResponse.json({ data: allTask });
}

export async function POST(req: Request) {
  const body: Timestamp[] = await req.json();

  const prisma = new PrismaClient();
  const taskId = Math.floor(Math.random() * 1000) + 1
  const newTask = await prisma.task.create({
    data: {
      name: `Task ${taskId}`,
      user: {
        connect: { username: 'Ranjabi' },
      },
    },
  });

  body.forEach(async ({startTime, endTime, secondsElapsed}) => {
    await prisma.session.create({
      data: {
        startTime: new Date(Number(startTime)),
        endTime: new Date(Number(endTime)),
        duration: secondsElapsed,
        task: {
          connect: { id: newTask.id }
        },
      },
    });
  });

  const task = await prisma.task.findFirst({
    include: {
      sessions: true
    },
    where: {
      name: `Task ${taskId}`
    }
  })

  return NextResponse.json({ data: task });
}