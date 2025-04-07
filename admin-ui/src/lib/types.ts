export type LanguageCode = "th" | "en";

export interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  picUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
  priceType: string;
  category: string;
  organization: {
    id: number;
    name: string;
    picUrl: string;
  };
  content: string;
  province: string;
  country: string;
  locationType: string;
  audience: string;
  status: "draft" | "published" | "";
  registerLink: string;
  updatedAt: string;
  categories: { label: string; value: string }[];
  contactChannels: { media: string; mediaLink: string }[];
}

export type EventFormValues = {
  picUrl: string;
  name: string;
  content: string;
  locationName: string;
  locationType: string;
  audience: string;
  province: string;
  country: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  latitude: string;
  longitude: string;
  priceType: string;
  registerLink: string;
  status: string;
  categories: [{ label: string; value: string }];
  contactChannels: { media: string; mediaLink: string }[];
};

export interface OrganizationCardProps {
  id: number;
  name: string;
  description: string;
  numberOfMembers: number;
  numberOfEvents: number;
  numberOfOpenJobs: number;
  picUrl?: string;
}

export interface JobProps {
  id: number;
  title: string;
  description: string;
  orgPicUrl: string;
  scope: string;
  prerequisite: {
    value: number;
    title: string;
    link: string;
  }[];
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
  categories: {
    value: number;
    label: string;
  }[];
  updatedAt: string;
}

export type JobFormValues = {
  title: string;
  scope: string;
  prerequisite: {
    title: string;
    link: string;
  }[];
  workplace: "remote" | "onsite" | "hybrid" | "";
  workType: "fulltime" | "parttime" | "volunteer" | "internship" | "";
  careerStage: "entrylevel" | "midlevel" | "senior" | "";
  period: string;
  description: string;
  qualifications: string;
  quantity: number;
  salary: number;
  province: string;
  country: string;
  status: "draft" | "published" | "";
  categories: [{ label: string; value: string }];
  registerLink: string;
};

export type AuthContextType = {
  isAuth: boolean | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setAuthState: () => void;
  removeAuthState: () => void;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  picUrl: string;
  language: string;
  role: string;
  updatedAt: string;
};
