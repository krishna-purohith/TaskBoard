"use client";

import Link from "next/link";
import { useAuthStore } from "@/app/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Users,
  LayoutDashboard,
  MessageSquare,
  Tag,
  Shield,
} from "lucide-react";
import Image from "next/image";
import k1 from "@/public/ss/k1.png";
import k2 from "@/public/ss/k2.png";
import k3 from "@/public/ss/k3.png";

const features = [
  {
    icon: Zap,
    title: "Real-time collaboration",
    description:
      "Changes appear instantly for every board member. No refresh needed — powered by WebSockets.",
  },
  {
    icon: Users,
    title: "Team boards",
    description:
      "Create boards and invite teammates. Everyone sees the same board, updated live.",
  },
  {
    icon: LayoutDashboard,
    title: "Flexible columns",
    description:
      "Organise work your way. Create any columns you need — Todo, In Progress, Done, or anything else.",
  },
  {
    icon: Tag,
    title: "Tags and priorities",
    description:
      "Label cards with colour-coded tags and set priority levels to keep the team focused.",
  },
  {
    icon: MessageSquare,
    title: "Card comments",
    description:
      "Discuss work directly on the card. Keep all context in one place.",
  },
  {
    icon: Shield,
    title: "Role-based access",
    description:
      "Owners manage the board and members. Members can edit without being able to disrupt team structure.",
  },
];

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-6">
          <Zap className="h-3 w-3" />
          Real-time collaboration
        </div>

        <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
          Your team&apos;s work,
          <br />
          <span className="text-primary">always in sync</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          TaskBoard is a collaborative task manager where every change is
          broadcast instantly to your whole team. No more stale pages or missed
          updates.
        </p>

        <div className="flex items-center justify-center gap-3">
          {user ? (
            <Button size="lg" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/signup">Get started free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <div className="border-t" />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">See it in action</h2>
          <p className="text-muted-foreground">
            Real-time updates, organised boards, team collaboration.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm mb-20">
            <Image
              src={k1}
              alt="TaskBoard dashboard"
              className="w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm">
              <Image
                src={k2}
                alt="Board view"
                className="w-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm">
              <Image
                src={k3}
                alt="Card detail"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold mb-3">
            Everything your team needs
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Built for teams that move fast and need their tools to keep up.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border/60 bg-card hover:border-border transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to keep your team in sync?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create a board in seconds. Invite your team. Start collaborating.
          </p>
          {user ? (
            <Button size="lg" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link href="/signup">Get started free</Link>
            </Button>
          )}
        </div>
      </section>

      <footer className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>TaskBoard</span>
          <span>Built with Next.js, Express, WebSockets and Prisma</span>
        </div>
      </footer>
    </div>
  );
}
