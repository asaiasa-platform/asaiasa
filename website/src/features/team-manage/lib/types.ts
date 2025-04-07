export type TeamMember = {
  role: "owner" | "moderator";
  user: {
    id: string;
    name: string;
    picUrl: string;
    email: string;
    role: string;
    updatedAt: string;
  };
};

export type Organization = {
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
};
