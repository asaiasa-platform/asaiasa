import { Briefcase, Calendar, LayoutDashboard, User2 } from "lucide-react";

export const mainLabel = "Management";

export const mainMenu = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    url: "team-management",
    icon: User2,
  },
  {
    title: "Jobs",
    url: "job-management",
    icon: Briefcase,
    // items: [
    //   { title: "Draft", url: "/job-management/draft" },
    //   { title: "Published", url: "/job-management/published" },
    // ],
  },
  {
    title: "Events",
    url: "event-management",
    icon: Calendar,
    // items: [
    //   { title: "Draft", url: "/event-management/draft" },
    //   { title: "Published", url: "/event-management/published" },
    // ],
  },
];
