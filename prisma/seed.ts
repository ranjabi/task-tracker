import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { username: 'ranjabi' },
    update: {},
    create: {
      username: 'ranjabi',
    },
  });

  const task = await prisma.task.create({
    data: {
      name: `Task ${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
    },
  });

  const session = await prisma.session.create({
    data: {
      startTime: new Date(Date.now() - 2 * 60 * 1000),
      endTime: new Date(),
      duration: 2 * 60,
      taskId: task.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
