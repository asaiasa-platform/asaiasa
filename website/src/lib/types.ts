import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
    lastName: z.string().min(1, { message: "กรุณากรอกนามสกุล" }),
    email: z.string().email({ message: "กรุณากรอกอีเมล" }),
    phone: z
      .string()
      .regex(/^\d+$/, { message: "กรุณากรอกตัวเลข" })
      .min(10, { message: "กรุณากรอกตัวเลข 10 ตัว" })
      .max(10, { message: "กรุณากรอกตัวเลข 10 ตัว" }),
    password: z
      .string()
      .min(8, { message: "ตวามยาวอย่างน้อย 8 ตัวอักษร" })
      .regex(/[A-Z]/, { message: "ต้องมีตัวอักษรพิมพ์ใหญ่" })
      .regex(/[a-z]/, { message: "ต้องมีตัวอักษรพิมพ์เล็ก" })
      .regex(/\d/, { message: "ต้องมีตัวเลขอย่างน้อยหนึ่งตัว" })
      .regex(/[!@#$%^&*_]/, {
        message: "ต้องมีอักขระพิเศษ (!@#$%^&*_)",
      }),
    confirmPassword: z.string(),
    policies: z.boolean().refine((val) => val === true, {
      message: "กรุณายอมรับข้อกำหนดและนโยบาย",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<typeof signupSchema>;

export interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  picUrl: string;
  locationName: string;
  locationType: string;
  province: string;
  country: string;
  audience: string;
  latitude: number | null;
  longitude: number | null;
  price: string;
  categories: { value: number; label: string }[];
  organization: {
    id: number;
    name: string;
    picUrl: string;
  };
  updatedAt: string;
}

export interface EventDescriptionProps {
  id: number;
  name: string;
  content: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  priceType: string;
  picUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
  contactChannels: { media: string; mediaLink: string }[];
  registerLink: string;
  organization: {
    id: number;
    name: string;
    picUrl: string;
  };
}

export type BriefOrganization = {
  name: string;
  imgUrl: string;
};

export interface OrganizationMap {
  id: number;
  pic_url: string;
  name: string;
  headline: string;
  latitude: number;
  longitude: number;
  industries: string[];
}

export interface OrganizationBrief {
  headline: string;
  industries: { id: number; name: string }[];
  country: string;
  province: string;
  id: number;
  name: string;
  picUrl: string;
}

export interface OrganizationDescription {
  id: number;
  name: string;
  email: string;
  phone: string;
  picUrl: string;
  bgUrl: string;
  headline: string;
  specialty: string;
  description: string;
  address: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  organizationContacts: [
    {
      media: string;
      mediaLink: string;
    }
  ];
  industries: [
    {
      id: number;
      name: string;
    }
  ];
  updatedAt: string;
}

export type UserProfile = {
  id: number; // userID
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  picUrl: string;
  language: string;
  role: string;
  updatedAt: string;
};

export type AuthContextType = {
  isAuth: boolean | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setAuthState: () => void;
  removeAuthState: () => void;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Category = {
  icon: React.ReactNode;
  id:
    | "all"
    | "incubation"
    | "networking"
    | "forum"
    | "exhibition"
    | "competition"
    | "workshop"
    | "campaign"
    | "environment"
    | "social"
    | "governance";
  title: string;
};

export type LanguageCode = "th" | "en";

export interface JobCardProps {
  id: number;
  title: string;
  description: string;
  workplace: string;
  workType: string;
  careerStage: string;
  salary: number;
  categories: {
    value: number;
    label: string;
  }[];
  organization: {
    id: number;
    name: string;
    picUrl: string;
  };
  province: string;
  country: string;
  updatedAt: string;
}

export interface JobDescriptionPage {
  id: number;
  title: string;
  description: string;
  orgPicUrl: string;
  scope: string;
  prerequisite: [
    {
      value: number;
      title: string;
      link: string;
    }
  ];
  workplace: string;
  workType: string;
  careerStage: string;
  period: string;
  qualifications: string;
  quantity: number;
  salary: number;
  province: string;
  country: string;
  status: string;
  registerLink: string;
  organization: {
    id: number;
    name: string;
    picUrl: string;
  };
  categories: [
    {
      value: number;
      label: string;
    }
  ];
  updatedAt: string;
}

export interface CategoryProps {
  value: number;
  label: string;
}

export interface UserStat {
  CategoryData: {
    amount: number;
    category: { value: number; label: string };
  }[];
  totalEvents: number;
}
