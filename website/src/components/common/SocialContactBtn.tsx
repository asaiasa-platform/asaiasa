"use client";

import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialContactButtonProps {
  mediaType: string;
  mediaLink: string;
  className?: string;
}

const SocialContactButton = ({
  mediaType,
  mediaLink,
  className = "",
}: SocialContactButtonProps) => {
  // Function to get the appropriate icon and color based on media type
  const getContactInfo = (mediaType: string) => {
    const type = mediaType.toLowerCase();
    if (type.includes("facebook"))
      return { icon: FaFacebook, color: "#1877F2" };
    if (type.includes("instagram"))
      return { icon: FaInstagram, color: "#E4405F" };
    if (type.includes("linkedin"))
      return { icon: FaLinkedin, color: "#0A66C2" };
    if (type.includes("twitter")) return { icon: FaTwitter, color: "#1DA1F2" };
    if (type.includes("website") || type.includes("เว็บไซต์"))
      return { icon: FaGlobe, color: "#000000" };
    return { icon: FaGlobe, color: "#000000" }; // Default icon
  };

  // Function to handle button click and open a new tab
  const handleOpenLink = (link: string) => {
    const url = link.includes("http") ? link : `https://${link}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const { icon: Icon, color } = getContactInfo(mediaType);

  return (
    <Button
      onClick={() => handleOpenLink(mediaLink)}
      variant="outline"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium w-fit rounded-full shrink-0",
        "hover:drop-shadow-md hover:scale-105 transition-all duration-200",
        className
      )}
      style={{
        backgroundColor: color,
        color: "white",
        borderColor: color,
      }}
    >
      <Icon size={18} color="white" />
      <span>{mediaType}</span>
    </Button>
  );
};

export default SocialContactButton;
