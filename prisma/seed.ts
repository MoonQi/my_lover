import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const milestones = [
    {
      date: new Date('2020-02-14'),
      title: '我们在一起的第一天',
      description: '在那个美丽的情人节，我们决定开始这段旅程。那天阳光很好，心情更好。',
    },
    {
      date: new Date('2020-12-25'),
      title: '第一个圣诞节',
      description: '一起度过的第一个节日，充满了温暖和快乐。交换礼物的那一刻，觉得未来可期。',
    },
    {
      date: new Date('2022-06-01'),
      title: '求婚',
      description: '人生中最重要的时刻之一。在海边的日落时分，我单膝跪地，她说愿意。',
    },
    {
      date: new Date('2023-03-14'),
      title: '白色情人节',
      description: '一起去看了樱花，拍了很多美美的照片。春天真好，和你在一起更好。',
    },
    {
      date: new Date('2024-08-18'),
      title: '纪念日旅行',
      description: '去了梦想中的地方旅行，留下了无数美好的回忆。每一刻都值得珍藏。',
    },
  ];

  for (const milestone of milestones) {
    await prisma.milestone.create({
      data: milestone,
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
