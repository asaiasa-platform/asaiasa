"use server";

import { AboutPage, TeamMember } from "../types";
import { getStrapiApiUrl } from "@/config/api";

// Standard API response type
interface ApiResponse<T> {
  code: number;
  data: T;
  page?: number;
  page_size?: number;
  total_page?: number;
  total_data?: number;
  message: string;
  data_schema: null;
}

export async function getAboutPage(): Promise<AboutPage | null> {
  // Use the Strapi API configuration
  const apiUrl = getStrapiApiUrl('about');
  
  try {
    console.log("Fetching about page from:", apiUrl);
    const res = await fetch(apiUrl, { 
      cache: "no-store",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      console.error("Failed to fetch about page:", res.status, res.statusText);
      return null;
    }
    
    const data = await res.json() as ApiResponse<AboutPage>;
    console.log("API response received");

    if (data.code === 0 && data.data) {
      // Return the data directly since it's already in the expected format
      return data.data;
    } else {
      console.error("Failed to fetch about page:", data.message || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Error fetching about page:", error);
    return null;
  }
}

interface TeamMembersResponse {
  data: TeamMember[];
  page: number;
  page_size: number;
  total_page: number;
  total_data: number;
}

export async function getTeamMembers(page = 1, pageSize = 10): Promise<TeamMembersResponse> {
  const apiUrl = getStrapiApiUrl(`teams?_page=${page}&_pageSize=${pageSize}&populate=image`);
  
  try {
    const res = await fetch(apiUrl, { 
      cache: "no-store",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch team members: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json() as ApiResponse<TeamMember[]>;

    if (data.code === 0) {
      return {
        data: data.data,
        page: data.page || 1,
        page_size: data.page_size || pageSize,
        total_page: data.total_page || 1,
        total_data: data.total_data || data.data.length
      };
    } else {
      console.error("Failed to fetch team members:", data.message);
      return {
        data: [],
        page: 1,
        page_size: pageSize,
        total_page: 0,
        total_data: 0
      };
    }
  } catch (error) {
    console.error("Error fetching team members:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total_page: 0,
      total_data: 0
    };
  }
} 