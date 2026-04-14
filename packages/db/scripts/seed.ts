import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // clean existing data
  await prisma.comment.deleteMany();
  await prisma.card.deleteMany();
  await prisma.column.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Bug", color: "RED" } }),
    prisma.tag.create({ data: { name: "Feature", color: "BLUE" } }),
    prisma.tag.create({ data: { name: "Urgent", color: "ORANGE" } }),
    prisma.tag.create({ data: { name: "Design", color: "PURPLE" } }),
    prisma.tag.create({ data: { name: "Docs", color: "GREEN" } }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const krishna = await prisma.user.create({
    data: {
      name: "Krishna",
      email: "krishna@gmail.com",
      password: hashedPassword,
    },
  });

  const john = await prisma.user.create({
    data: {
      name: "John",
      email: "john@gmail.com",
      password: hashedPassword,
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah",
      email: "sarah@gmail.com",
      password: hashedPassword,
    },
  });

  console.log(`✅ Created 3 users`);

  // create board 1
  const board1 = await prisma.board.create({
    data: {
      title: "TaskBoard",
      description: "Main project board",
      members: {
        create: [
          { userId: krishna.id, role: "OWNER" },
          { userId: john.id, role: "MEMBER" },
          { userId: sarah.id, role: "MEMBER" },
        ],
      },
    },
  });

  // create board 2
  const board2 = await prisma.board.create({
    data: {
      title: "Marketing",
      description: "Marketing campaigns",
      members: {
        create: [
          { userId: john.id, role: "OWNER" },
          { userId: krishna.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log(`✅ Created 2 boards`);

  // create columns for board 1
  const todoCol = await prisma.column.create({
    data: { title: "Todo", boardId: board1.id },
  });

  const inProgressCol = await prisma.column.create({
    data: { title: "In Progress", boardId: board1.id },
  });

  const reviewCol = await prisma.column.create({
    data: { title: "Review", boardId: board1.id },
  });

  const doneCol = await prisma.column.create({
    data: { title: "Done", boardId: board1.id },
  });

  // create columns for board 2
  const ideasCol = await prisma.column.create({
    data: { title: "Ideas", boardId: board2.id },
  });

  const activeCol = await prisma.column.create({
    data: { title: "Active", boardId: board2.id },
  });

  console.log(`✅ Created 6 columns`);

  // create cards for board 1
  const card1 = await prisma.card.create({
    data: {
      title: "Setup authentication",
      description: "Implement JWT auth with bcrypt",
      priority: "HIGH",
      columnId: doneCol.id,
      assigneeId: krishna.id,
      tags: { connect: [{ id: tags[1].id }] },
    },
  });

  const card2 = await prisma.card.create({
    data: {
      title: "Fix login bug",
      description: "Users getting 401 on valid credentials",
      priority: "HIGH",
      columnId: inProgressCol.id,
      assigneeId: john.id,
      tags: { connect: [{ id: tags[0].id }, { id: tags[2].id }] },
    },
  });

  const card3 = await prisma.card.create({
    data: {
      title: "Build board UI",
      description: "Trello-style drag and drop board",
      priority: "MEDIUM",
      columnId: inProgressCol.id,
      assigneeId: krishna.id,
      tags: { connect: [{ id: tags[3].id }] },
    },
  });

  const card4 = await prisma.card.create({
    data: {
      title: "Write API docs",
      description: "Document all REST endpoints",
      priority: "LOW",
      columnId: todoCol.id,
      assigneeId: sarah.id,
      tags: { connect: [{ id: tags[4].id }] },
    },
  });

  const card5 = await prisma.card.create({
    data: {
      title: "Add WebSocket support",
      description: "Real-time updates for board changes",
      priority: "HIGH",
      columnId: reviewCol.id,
      assigneeId: krishna.id,
      tags: { connect: [{ id: tags[1].id }, { id: tags[2].id }] },
    },
  });

  const card6 = await prisma.card.create({
    data: {
      title: "Setup CI/CD pipeline",
      description: "GitHub Actions for automated deploys",
      priority: "MEDIUM",
      columnId: todoCol.id,
      tags: { connect: [{ id: tags[1].id }] },
    },
  });

  // create cards for board 2
  await prisma.card.create({
    data: {
      title: "Q2 campaign strategy",
      description: "Plan social media campaigns for Q2",
      priority: "HIGH",
      columnId: ideasCol.id,
      assigneeId: john.id,
    },
  });

  await prisma.card.create({
    data: {
      title: "Design new banner",
      description: "Create banner for homepage",
      priority: "MEDIUM",
      columnId: activeCol.id,
      assigneeId: sarah.id,
      tags: { connect: [{ id: tags[3].id }] },
    },
  });

  console.log(`✅ Created 8 cards`);

  // create comments
  await prisma.comment.create({
    data: {
      content: "Started working on this, should be done by EOD",
      cardId: card2.id,
      userId: john.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Let me know if you need help with this",
      cardId: card2.id,
      userId: krishna.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "WebSocket server is up, testing now",
      cardId: card5.id,
      userId: krishna.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Looks good, approving after final review",
      cardId: card5.id,
      userId: john.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "I can help with the API documentation",
      cardId: card4.id,
      userId: john.id,
    },
  });

  console.log(`✅ Created 5 comments`);

  console.log("\n🎉 Seeding complete!\n");
  console.log("Test credentials:");
  console.log("  krishna@gmail.com / password123  (OWNER of TaskBoard)");
  console.log("  john@gmail.com    / password123  (OWNER of Marketing)");
  console.log("  sarah@gmail.com   / password123  (MEMBER)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
