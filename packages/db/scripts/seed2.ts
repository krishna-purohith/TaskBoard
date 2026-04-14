import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding rich data...\n");

  await prisma.comment.deleteMany();
  await prisma.card.deleteMany();
  await prisma.column.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Bug", color: "RED" } }),
    prisma.tag.create({ data: { name: "Feature", color: "BLUE" } }),
    prisma.tag.create({ data: { name: "Urgent", color: "ORANGE" } }),
    prisma.tag.create({ data: { name: "Design", color: "PURPLE" } }),
    prisma.tag.create({ data: { name: "Docs", color: "GREEN" } }),
    prisma.tag.create({ data: { name: "Backend", color: "YELLOW" } }),
    prisma.tag.create({ data: { name: "Frontend", color: "PINK" } }),
  ]);

  const [
    bugTag,
    featureTag,
    urgentTag,
    designTag,
    docsTag,
    backendTag,
    frontendTag,
  ] = tags;
  console.log(`✅ Created ${tags.length} tags`);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Krishna",
        email: "krishna@gmail.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Chen",
        email: "sarah@gmail.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "John Marcus",
        email: "john@gmail.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Sharma",
        email: "priya@gmail.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex@gmail.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Mei Zhang",
        email: "mei@gmail.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Rahul Dev",
        email: "rahul@gmail.com",
        password: hashedPassword,
      },
    }),
  ]);

  const [krishna, sarah, john, priya, alex, mei, rahul] = users;
  console.log(`✅ Created ${users.length} users`);

  // ================================================================
  // BOARD 1 — E-commerce Platform Launch (Krishna's main board)
  // ================================================================
  const board1 = await prisma.board.create({
    data: {
      title: "E-commerce Platform Launch",
      description: "Planning and execution for the new online store launch",
      members: {
        create: [
          { userId: krishna.id, role: "OWNER" },
          { userId: sarah.id, role: "MEMBER" },
          { userId: john.id, role: "MEMBER" },
          { userId: priya.id, role: "MEMBER" },
          { userId: alex.id, role: "MEMBER" },
          { userId: mei.id, role: "MEMBER" },
        ],
      },
    },
  });

  const [backlog, inProgress, review, done] = await Promise.all([
    prisma.column.create({ data: { title: "Backlog", boardId: board1.id } }),
    prisma.column.create({
      data: { title: "In Progress", boardId: board1.id },
    }),
    prisma.column.create({ data: { title: "Review", boardId: board1.id } }),
    prisma.column.create({ data: { title: "Done", boardId: board1.id } }),
  ]);

  const backlogCards = await Promise.all([
    prisma.card.create({
      data: {
        title: "Loyalty points system",
        description:
          "Allow customers to earn and redeem points on every purchase",
        priority: "LOW",
        columnId: backlog.id,
        assigneeId: alex.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Multi-currency support",
        description: "Display prices in USD, EUR, GBP based on user location",
        priority: "MEDIUM",
        columnId: backlog.id,
        assigneeId: john.id,
        tags: { connect: [{ id: featureTag.id }, { id: backendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Product comparison tool",
        description: "Let users compare up to 3 products side by side",
        priority: "LOW",
        columnId: backlog.id,
        tags: { connect: [{ id: featureTag.id }, { id: frontendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Abandoned cart recovery",
        description: "Send automated email reminders for incomplete checkouts",
        priority: "MEDIUM",
        columnId: backlog.id,
        assigneeId: priya.id,
        tags: { connect: [{ id: featureTag.id }, { id: backendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Wishlist feature",
        description: "Users can save products to a personal wishlist",
        priority: "MEDIUM",
        columnId: backlog.id,
        assigneeId: mei.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Bulk discount rules",
        description: "Configure tiered discounts based on order quantity",
        priority: "LOW",
        columnId: backlog.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Return and refund portal",
        description: "Self-service portal for customers to initiate returns",
        priority: "LOW",
        columnId: backlog.id,
        assigneeId: sarah.id,
        tags: { connect: [{ id: featureTag.id }, { id: designTag.id }] },
      },
    }),
  ]);

  const inProgressCards = await Promise.all([
    prisma.card.create({
      data: {
        title: "Checkout flow redesign",
        description:
          "Simplify the 5-step checkout to a single page with inline validation",
        priority: "HIGH",
        columnId: inProgress.id,
        assigneeId: sarah.id,
        dueDate: new Date("2026-04-20"),
        tags: { connect: [{ id: frontendTag.id }, { id: designTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Product search with filters",
        description:
          "Elasticsearch-powered search with category, price range and rating filters",
        priority: "HIGH",
        columnId: inProgress.id,
        assigneeId: krishna.id,
        dueDate: new Date("2026-04-22"),
        tags: { connect: [{ id: featureTag.id }, { id: backendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Payment gateway integration",
        description:
          "Stripe integration with support for cards, wallets and UPI",
        priority: "HIGH",
        columnId: inProgress.id,
        assigneeId: john.id,
        dueDate: new Date("2026-04-18"),
        tags: { connect: [{ id: backendTag.id }, { id: urgentTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Inventory management dashboard",
        description:
          "Real-time stock levels, low stock alerts and reorder triggers",
        priority: "MEDIUM",
        columnId: inProgress.id,
        assigneeId: priya.id,
        dueDate: new Date("2026-04-25"),
        tags: { connect: [{ id: frontendTag.id }, { id: backendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Mobile app performance",
        description:
          "Reduce app load time from 4.2s to under 1.5s on 3G networks",
        priority: "HIGH",
        columnId: inProgress.id,
        assigneeId: krishna.id,
        dueDate: new Date("2026-04-19"),
        tags: { connect: [{ id: urgentTag.id }, { id: frontendTag.id }] },
      },
    }),
  ]);

  const reviewCards = await Promise.all([
    prisma.card.create({
      data: {
        title: "Product image zoom",
        description:
          "Pinch-to-zoom on mobile and hover zoom on desktop product pages",
        priority: "MEDIUM",
        columnId: review.id,
        assigneeId: mei.id,
        dueDate: new Date("2026-04-16"),
        tags: { connect: [{ id: frontendTag.id }, { id: designTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Customer review system",
        description:
          "Star ratings with verified purchase badge and admin moderation",
        priority: "HIGH",
        columnId: review.id,
        assigneeId: alex.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Order tracking page",
        description:
          "Real-time order status with map view for last-mile delivery",
        priority: "MEDIUM",
        columnId: review.id,
        assigneeId: john.id,
        tags: { connect: [{ id: featureTag.id }, { id: frontendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Admin analytics dashboard",
        description:
          "Revenue, conversion rate, top products and customer acquisition charts",
        priority: "HIGH",
        columnId: review.id,
        assigneeId: priya.id,
        dueDate: new Date("2026-04-17"),
        tags: { connect: [{ id: featureTag.id }, { id: designTag.id }] },
      },
    }),
  ]);

  const doneCards = await Promise.all([
    prisma.card.create({
      data: {
        title: "User registration and login",
        description:
          "Email/password auth with OAuth support for Google and Apple",
        priority: "HIGH",
        columnId: done.id,
        assigneeId: krishna.id,
        tags: { connect: [{ id: featureTag.id }, { id: backendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Product catalog page",
        description: "Grid and list view with lazy loading and infinite scroll",
        priority: "HIGH",
        columnId: done.id,
        assigneeId: sarah.id,
        tags: { connect: [{ id: frontendTag.id }, { id: designTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Shopping cart",
        description: "Persistent cart with quantity controls and price summary",
        priority: "HIGH",
        columnId: done.id,
        assigneeId: krishna.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Product detail page",
        description:
          "Image gallery, size selector, add to cart and related products",
        priority: "HIGH",
        columnId: done.id,
        assigneeId: mei.id,
        tags: { connect: [{ id: frontendTag.id }, { id: designTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Email order confirmation",
        description:
          "Branded transactional emails with order summary and tracking link",
        priority: "MEDIUM",
        columnId: done.id,
        assigneeId: alex.id,
        tags: { connect: [{ id: backendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Address book",
        description: "Save multiple delivery addresses with default selection",
        priority: "MEDIUM",
        columnId: done.id,
        assigneeId: priya.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
  ]);

  await Promise.all([
    prisma.comment.create({
      data: {
        content:
          "Single page checkout is live on staging — conversion rate already up 12% in A/B test",
        cardId: inProgressCards[0].id,
        userId: sarah.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Great numbers! Is the address autofill working on iOS Safari?",
        cardId: inProgressCards[0].id,
        userId: krishna.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Found a bug — autofill skips the postal code field on Safari 17. Fixing now",
        cardId: inProgressCards[0].id,
        userId: sarah.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Stripe webhooks are configured for payment_intent.succeeded and payment_intent.failed",
        cardId: inProgressCards[2].id,
        userId: john.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "What about refund handling? Do we need a webhook for charge.refunded too?",
        cardId: inProgressCards[2].id,
        userId: krishna.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Yes added charge.refunded and dispute.created — both update order status in DB",
        cardId: inProgressCards[2].id,
        userId: john.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Good catch on the idempotency keys — will prevent duplicate charges on retry",
        cardId: inProgressCards[2].id,
        userId: priya.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Search is returning results in 180ms average, well within the 300ms target",
        cardId: inProgressCards[1].id,
        userId: krishna.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Filters are working great. Can we add a sort by most reviewed option?",
        cardId: inProgressCards[1].id,
        userId: mei.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Added sort by: newest, price low-high, price high-low, most reviewed, top rated",
        cardId: inProgressCards[1].id,
        userId: krishna.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Review moderation queue is built — admins can approve, reject or flag reviews",
        cardId: reviewCards[1].id,
        userId: alex.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Should we auto-approve reviews from verified purchases above 3 stars?",
        cardId: reviewCards[1].id,
        userId: krishna.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Good idea — added a setting in admin panel to toggle auto-approval threshold",
        cardId: reviewCards[1].id,
        userId: alex.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Analytics dashboard is showing revenue data correctly. Conversion funnel looks off though",
        cardId: reviewCards[3].id,
        userId: priya.id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "The funnel was counting page refreshes as new sessions — fixed the deduplication logic",
        cardId: reviewCards[3].id,
        userId: krishna.id,
      },
    }),
  ]);

  console.log(
    `✅ Created Board 1 with ${backlogCards.length + inProgressCards.length + reviewCards.length + doneCards.length} cards`
  );

  // ================================================================
  // BOARD 2 — Mobile App Redesign
  // ================================================================
  const board2 = await prisma.board.create({
    data: {
      title: "Mobile App Redesign",
      description: "Complete visual overhaul of the iOS and Android apps",
      members: {
        create: [
          { userId: sarah.id, role: "OWNER" },
          { userId: krishna.id, role: "MEMBER" },
          { userId: mei.id, role: "MEMBER" },
          { userId: rahul.id, role: "MEMBER" },
        ],
      },
    },
  });

  const [discovery, design2, dev2, shipped2] = await Promise.all([
    prisma.column.create({ data: { title: "Discovery", boardId: board2.id } }),
    prisma.column.create({ data: { title: "Design", boardId: board2.id } }),
    prisma.column.create({
      data: { title: "Development", boardId: board2.id },
    }),
    prisma.column.create({ data: { title: "Shipped", boardId: board2.id } }),
  ]);

  await Promise.all([
    prisma.card.create({
      data: {
        title: "User interview synthesis",
        description:
          "Consolidate findings from 24 user interviews into key themes",
        priority: "HIGH",
        columnId: shipped2.id,
        assigneeId: sarah.id,
        tags: { connect: [{ id: docsTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Navigation redesign",
        description:
          "Move from hamburger menu to bottom tab bar for better thumb reach",
        priority: "HIGH",
        columnId: design2.id,
        assigneeId: sarah.id,
        dueDate: new Date("2026-04-20"),
        tags: { connect: [{ id: designTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Onboarding flow",
        description: "3-screen onboarding with personalization questions",
        priority: "HIGH",
        columnId: dev2.id,
        assigneeId: rahul.id,
        dueDate: new Date("2026-04-22"),
        tags: { connect: [{ id: designTag.id }, { id: frontendTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Push notification preferences",
        description: "Granular controls for different notification types",
        priority: "MEDIUM",
        columnId: discovery.id,
        assigneeId: mei.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Dark mode support",
        description: "Full dark mode with system preference detection",
        priority: "MEDIUM",
        columnId: dev2.id,
        assigneeId: krishna.id,
        tags: { connect: [{ id: designTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Home screen widgets",
        description: "iOS 16 interactive widgets for quick order status",
        priority: "LOW",
        columnId: discovery.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
  ]);

  console.log(`✅ Created Board 2: Mobile App Redesign`);

  // ================================================================
  // BOARD 3 — Marketing Campaign Q2
  // ================================================================
  const board3 = await prisma.board.create({
    data: {
      title: "Marketing Campaign Q2",
      description: "Spring sale and new user acquisition campaign",
      members: {
        create: [
          { userId: priya.id, role: "OWNER" },
          { userId: krishna.id, role: "MEMBER" },
          { userId: alex.id, role: "MEMBER" },
        ],
      },
    },
  });

  const [ideas3, production3, live3] = await Promise.all([
    prisma.column.create({ data: { title: "Ideas", boardId: board3.id } }),
    prisma.column.create({
      data: { title: "In Production", boardId: board3.id },
    }),
    prisma.column.create({ data: { title: "Live", boardId: board3.id } }),
  ]);

  await Promise.all([
    prisma.card.create({
      data: {
        title: "Spring sale landing page",
        description:
          "Limited time offer page with countdown timer and featured products",
        priority: "HIGH",
        columnId: production3.id,
        assigneeId: priya.id,
        dueDate: new Date("2026-04-18"),
        tags: { connect: [{ id: designTag.id }, { id: urgentTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Influencer partnership brief",
        description:
          "Outreach deck for 10 micro-influencers in the lifestyle niche",
        priority: "MEDIUM",
        columnId: ideas3.id,
        assigneeId: alex.id,
        tags: { connect: [{ id: docsTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Email campaign — re-engagement",
        description:
          "Win back inactive users with a personalized discount offer",
        priority: "HIGH",
        columnId: live3.id,
        assigneeId: priya.id,
        tags: { connect: [{ id: urgentTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Social media content calendar",
        description: "30 days of posts for Instagram, Twitter and LinkedIn",
        priority: "MEDIUM",
        columnId: production3.id,
        assigneeId: alex.id,
        dueDate: new Date("2026-04-20"),
        tags: { connect: [{ id: designTag.id }] },
      },
    }),
    prisma.card.create({
      data: {
        title: "Referral program",
        description:
          "Give 10% off to both referrer and new customer on first purchase",
        priority: "MEDIUM",
        columnId: ideas3.id,
        assigneeId: krishna.id,
        tags: { connect: [{ id: featureTag.id }] },
      },
    }),
  ]);

  console.log(`✅ Created Board 3: Marketing Campaign Q2`);

  // ================================================================
  // BOARD 4 — Krishna's Personal Tasks
  // ================================================================
  const board4 = await prisma.board.create({
    data: {
      title: "Personal Tasks",
      description: "My own task tracker",
      members: {
        create: [{ userId: krishna.id, role: "OWNER" }],
      },
    },
  });

  const [today4, thisWeek4, someday4] = await Promise.all([
    prisma.column.create({ data: { title: "Today", boardId: board4.id } }),
    prisma.column.create({ data: { title: "This Week", boardId: board4.id } }),
    prisma.column.create({ data: { title: "Someday", boardId: board4.id } }),
  ]);

  await Promise.all([
    prisma.card.create({
      data: {
        title: "Book dentist appointment",
        priority: "HIGH",
        columnId: today4.id,
        assigneeId: krishna.id,
        dueDate: new Date("2026-04-15"),
      },
    }),
    prisma.card.create({
      data: {
        title: "Renew car insurance",
        description: "Compare quotes from at least 3 providers before renewing",
        priority: "HIGH",
        columnId: today4.id,
        assigneeId: krishna.id,
        dueDate: new Date("2026-04-16"),
      },
    }),
    prisma.card.create({
      data: {
        title: "Gym — leg day",
        priority: "MEDIUM",
        columnId: today4.id,
        assigneeId: krishna.id,
      },
    }),
    prisma.card.create({
      data: {
        title: "Read Atomic Habits chapters 9–12",
        priority: "LOW",
        columnId: thisWeek4.id,
        assigneeId: krishna.id,
      },
    }),
    prisma.card.create({
      data: {
        title: "Plan weekend trip to Coorg",
        description: "Check hotels, road conditions and weather forecast",
        priority: "MEDIUM",
        columnId: thisWeek4.id,
        assigneeId: krishna.id,
        dueDate: new Date("2026-04-20"),
      },
    }),
    prisma.card.create({
      data: {
        title: "Call parents",
        priority: "HIGH",
        columnId: thisWeek4.id,
        assigneeId: krishna.id,
      },
    }),
    prisma.card.create({
      data: {
        title: "Learn to play guitar",
        priority: "LOW",
        columnId: someday4.id,
      },
    }),
    prisma.card.create({
      data: {
        title: "Start a personal blog",
        description: "Write about tech, productivity and travel",
        priority: "LOW",
        columnId: someday4.id,
      },
    }),
    prisma.card.create({
      data: {
        title: "Complete AWS Solutions Architect cert",
        priority: "MEDIUM",
        columnId: someday4.id,
      },
    }),
  ]);

  console.log(`✅ Created Board 4: Personal Tasks`);

  console.log("\n🎉 Rich seed complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test credentials (all password: password123)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("krishna@gmail.com  → 4 boards ← USE THIS FOR SCREENSHOTS");
  console.log("sarah@gmail.com    → 2 boards");
  console.log("john@gmail.com     → 1 board");
  console.log("priya@gmail.com    → 2 boards");
  console.log("alex@gmail.com     → 2 boards");
  console.log("mei@gmail.com      → 2 boards");
  console.log("rahul@gmail.com    → 1 board");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
