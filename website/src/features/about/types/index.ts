export interface AboutPage {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  dynamic_zone: AboutDynamicZone[];
}

export type AboutDynamicZone = 
  | RichTextSection
  | WhatWeDoSection
  | TeamSection;

export interface RichTextSection {
  id: string;
  __component: "about.rich-text-section";
  section_type: "WhoWeAre" | "Vision" | "Mission" | "WhyWeDo";
  content: string;
}

export interface WhatWeDoSection {
  id: string;
  __component: "about.what-we-do-section";
  audience_type: "Volunteers" | "Organizations" | "Partners";
  description: string;
}

export interface TeamSection {
  id: string;
  __component: "about.team-section";
  title: string;
  description?: string;
  team_members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: {
    data: {
      id: string;
      attributes: {
        url: string;
        formats: {
          thumbnail: { url: string };
          small: { url: string };
          medium: { url: string };
          large: { url: string };
        };
      };
    };
  };
  linkedin?: string;
  twitter?: string;
} 