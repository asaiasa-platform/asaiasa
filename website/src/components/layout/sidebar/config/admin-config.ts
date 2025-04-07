import { Briefcase, Building, Calendar, User2 } from "lucide-react";

export const adminLabel = "Admin";

export const adminMenu = [
  // Single menu item
  {
    title: "All users",
    url: "/admin/all-users",
    icon: User2,
  },
  {
    title: "All organizations",
    url: "/admin/all-orgs",
    icon: Building,
    // items: [
    //   { title: "Draft", url: "/org-management/draft" },
    //   { title: "Published", url: "/org-management/published" },
    // ],
  },
  {
    title: "All open jobs",
    url: "/admin/all-jobs",
    icon: Briefcase,
    // items: [
    //   { title: "Draft", url: "/job-management/draft" },
    //   { title: "Published", url: "/job-management/published" },
    // ],
  },
  {
    title: "All events",
    url: "/admin/all-events",
    icon: Calendar,
    // items: [
    //   { title: "Draft", url: "/event-management/draft" },
    //   { title: "Published", url: "/event-management/published" },
    // ],
  },
];
