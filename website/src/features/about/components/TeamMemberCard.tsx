"use client";

import { TeamMember } from "../types";
import Image from "next/image";
import { Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  member: TeamMember;
  className?: string;
}

export default function TeamMemberCard({ member, className }: Props) {
  const { name, role, bio, image, linkedin, twitter } = member;
  
  // Get the image URL from the nested data structure
  const imgUrl = image?.data?.attributes?.url;
  const thumbnailUrl = 
    image?.data?.attributes?.formats?.medium?.url || 
    image?.data?.attributes?.formats?.small?.url || 
    image?.data?.attributes?.formats?.thumbnail?.url;
  
  // If the URL doesn't start with http, prepend the CMS URL
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder-profile.jpg";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_CMS_URL || ''}${url}`;
  };
  
  const imageSource = getFullImageUrl(thumbnailUrl || imgUrl);

  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)}>
      <div className="relative h-60 w-full">
        <Image
          src={imageSource}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-gray-600 mb-4">{role}</p>
        
        {bio && (
          <div 
            className="text-gray-700 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: bio }}
          />
        )}
        
        {(linkedin || twitter) && (
          <div className="flex gap-4 mt-4">
            {linkedin && (
              <a 
                href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            
            {twitter && (
              <a 
                href={twitter.startsWith("http") ? twitter : `https://twitter.com/${twitter}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
                aria-label="Twitter profile"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 