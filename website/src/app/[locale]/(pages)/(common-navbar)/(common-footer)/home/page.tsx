"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import HeroSection from "@/features/home/components/hero";
import EventCarousel from "@/features/home/components/EventCarousel";
import JobShowcase from "@/features/home/components/JobShowcase";
import OrgCarousel from "@/features/home/components/OrgCarousel";
import {
  getFeaturedEvents,
  getRecentJobs,
  getRecentOrgs,
  getRecommendedEvents,
} from "@/features/home/api/action";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import { useState, useEffect } from "react";
import { Event, JobCardProps, OrganizationBrief } from "@/lib/types";

interface HomeProps {
  params: {
    locale: string;
  };
}

export default function Home({ params }: Readonly<HomeProps>) {
  const pathname = usePathname();
  useRouteProtection(pathname);

  const [data, setData] = useState<{
    recentJobs: JobCardProps[] | null;
    recentOrgs: OrganizationBrief[] | null;
    featuredEvents: Event[] | null;
    recommendedEvents: Event[] | null;
  }>({
    recentJobs: null,
    recentOrgs: null,
    featuredEvents: null,
    recommendedEvents: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get translations
  const t = useTranslations("HomePage");
  const eventsT = useTranslations("Events");
  const orgsT = useTranslations("Organizations");
  const commonT = useTranslations("Common.buttons");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data concurrently
        const [recentJobs, recentOrgs, featuredEvents, recommendedEvents] =
          await Promise.all([
            getRecentJobs(),
            getRecentOrgs(),
            getFeaturedEvents(),
            getRecommendedEvents(),
          ]);

        setData({
          recentJobs,
          recentOrgs,
          featuredEvents,
          recommendedEvents,
        });
      } catch (err) {
        console.error("Error fetching home page data:", err);
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">{error}</div>
    );
  }

  const { recentJobs, recentOrgs, featuredEvents, recommendedEvents } = data;

  return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSection />

        <main className="font-prompt flex-grow">
          {/* Recommended Events Section */}
          {recommendedEvents && recommendedEvents.length > 0 && (
            <section className="pt-16 bg-white">
              <div className="max-w-[1170px] mx-auto px-6">
                <div className="flex justify-between items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {t("recommendedEvents.title")}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {t("recommendedEvents.description")}
                    </p>
                  </div>
                </div>
                <EventCarousel events={recommendedEvents} />
              </div>
            </section>
          )}

          {/* Featured Events Section */}
          {featuredEvents && featuredEvents.length > 0 && (
            <section className="py-16 bg-white">
              <div className="max-w-[1170px] mx-auto px-6">
                <div className="flex justify-between items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {eventsT("featured")}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {t("featuredEvents.description")}
                    </p>
                  </div>
                  <Link
                    href="/events/page/1?category=all"
                    className="text-orange-dark hover:text-orange-normal flex items-center gap-1 font-medium shrink-0 group"
                  >
                    {commonT("viewAll")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
                <EventCarousel events={featuredEvents} />
              </div>
            </section>
          )}

          {/* Jobs Section */}
          {recentJobs && recentJobs.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="max-w-[1170px] mx-auto px-6">
                <div className="flex justify-between items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {t("latestJobs.title")}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {t("latestJobs.description")}
                    </p>
                  </div>
                </div>
                <JobShowcase jobs={recentJobs} />
                <div className="flex justify-center mt-10">
                  <Link
                    href="/jobs/page/1"
                    className="bg-white border border-orange-normal text-orange-dark hover:bg-orange-50 px-8 py-2 rounded-md"
                  >
                    {t("viewMoreJobs")}
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Organizations Section */}
          {recentOrgs && recentOrgs.length > 0 && (
            <section className="py-16 bg-white">
              <div className="max-w-[1170px] mx-auto px-6">
                <div className="flex justify-between items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {orgsT("featured")}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {t("organizations.description")}
                    </p>
                  </div>
                  <Link
                    href="/orgs"
                    className="text-orange-dark hover:text-orange-normal flex items-center gap-1 font-medium shrink-0 group"
                  >
                    {commonT("viewAll")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
                <OrgCarousel orgs={recentOrgs} locale={params.locale} />
              </div>
            </section>
          )}
        </main>
      </div>
    );
}
