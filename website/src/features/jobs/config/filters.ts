import { Building2, Leaf, Users } from "lucide-react";

export const WorkTypeEnum = [
  {
    value: "fulltime",
    label: "Full-time",
  },
  {
    value: "parttime",
    label: "Part-time",
  },
  {
    value: "volunteer",
    label: "Volunteer",
  },
  {
    value: "internship",
    label: "Internship",
  },
];
export const CareerStageEnum = [
  {
    value: "entrylevel",
    label: "Entry-level",
  },
  {
    value: "midlevel",
    label: "Mid-level",
  },
  {
    value: "senior",
    label: "Senior",
  },
];

export const ESGJobCategory = [
  {
    icon: Leaf,
    value: "environment",
    label: "สิ่งแวดล้อม",
  },
  {
    icon: Users,
    value: "social",
    label: "สังคม",
  },
  {
    icon: Building2,
    value: "governance",
    label: "ธรรมาภิบาล",
  },
  {
    icon: null,
    value: "general",
    label: "งานทั่วไป",
  },
];
