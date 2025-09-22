"use client";

import { useEffect, useState } from "react";
import { getAboutPage } from "@/features/about/api/action";
import AboutClientComponent from "./components/AboutClient";
import { usePathname } from "next/navigation";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import { AboutPage as AboutPageType } from "@/features/about/types";

// Convert to Client Component for CSR
export default function AboutPage() {
  const pathname = usePathname();
  useRouteProtection(pathname);

  const [aboutData, setAboutData] = useState<AboutPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAboutPage();
        
        if (data) {
          setAboutData(data);
        } else {
          setError("Failed to load about page data");
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
        setError("Failed to load about page data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          <div className="py-10 text-center text-gray-500">
            Content is being updated. Please check back later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{aboutData.title || "About Us"}</h1>
        
        {/* Pass the JSON data as a serialized prop */}
        <AboutClientComponent dataJson={JSON.stringify(aboutData)} />
      </div>
    </div>
  );
} 