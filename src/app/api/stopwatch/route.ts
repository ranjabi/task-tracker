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
  const body = await req.json();
  const taskName = body.taskName as string
  const timeStamp = body.timeStamp as Timestamp[]

  const prisma = new PrismaClient();
  const newTask = await prisma.task.create({
    data: {
      name: taskName,
      user: {
        connect: { username: 'Ranjabi' },
      },
    },
  });

  await prisma.session.createMany({
    data: timeStamp.map(({startTime, endTime, secondsElapsed}) => ({
      startTime: new Date(Number(startTime)),
      endTime: new Date(Number(endTime)),
      duration: secondsElapsed,
      taskId: newTask.id
    }))
  })

  const task = await prisma.task.findFirst({
    include: {
      sessions: true
    },
    where: {
      id: newTask.id,
      sessions: {
        some: {}
      }
    }
  })

  return NextResponse.json({ data: task });
}