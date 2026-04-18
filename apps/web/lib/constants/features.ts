import {
  Zap,
  Users,
  LayoutDashboard,
  MessageSquare,
  Tag,
  Shield,
} from "lucide-react";
export const features = [
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
