"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import DynamicZoneRenderer from "@/features/about/components/DynamicZoneRenderer";
import { AboutPage } from "@/features/about/types";

interface AboutClientProps {
  dataJson: string;
}

export default function AboutClient({ dataJson }: AboutClientProps) {
  const t = useTranslations("About");
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    try {
      if (dataJson) {
        const parsedData = JSON.parse(dataJson) as AboutPage;
        setAboutData(parsedData);
      } else {
        setError("No data available");
      }
    } catch (e) {
      console.error("Error parsing about data:", e);
      setError("Error loading content");
    }
  }, [dataJson]);

  // Debug mode toggle (only in development)
  const isDevMode = process.env.NODE_ENV === 'development';

  if (error) {
    return (
      <div className="py-10">
        <div className="text-center text-gray-500 mb-8">
          {t("errorLoading", { defaultValue: `Failed to load content: ${error}` })}
        </div>
        
        {isDevMode && (
          <div className="mt-10 p-4 border border-gray-300 rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Debug Information</h3>
              <button 
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {showDebug && (
              <div className="mt-4">
                <p><strong>Error:</strong> {error}</p>
                <p><strong>Data JSON:</strong> {dataJson || 'No data received'}</p>
                <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_GO_API_URL}/api/about</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (!aboutData || !aboutData.dynamic_zone || aboutData.dynamic_zone.length === 0) {
    return (
      <div className="py-10">
        <div className="text-center text-gray-500 mb-8">
          {t("noContent", { defaultValue: "Content is being updated. Please check back later." })}
        </div>
        
        {isDevMode && (
          <div className="mt-10 p-4 border border-gray-300 rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Debug Information</h3>
              <button 
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {showDebug && (
              <div className="mt-4">
                <p><strong>Data received:</strong> {aboutData ? 'Yes' : 'No'}</p>
                <p><strong>Data has dynamic_zone:</strong> {aboutData?.dynamic_zone ? 'Yes' : 'No'}</p>
                <p><strong>Dynamic zone length:</strong> {aboutData?.dynamic_zone?.length || 0}</p>
                <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_GO_API_URL}/api/about</p>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(aboutData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return <DynamicZoneRenderer blocks={aboutData.dynamic_zone} />;
} 