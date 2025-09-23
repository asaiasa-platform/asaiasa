import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/base/buttons/button';
import { api, Event, Job, Organization } from '@/services/api';
import EventCard from '@/components/common/event-card';
import OrganizationCard from '@/components/common/organization-card';
import HeroSection from '@/components/common/hero-section';

const HomePage: React.FC = () => {
  const [data, setData] = useState<{
    recentJobs: Job[];
    recentOrgs: Organization[];
    featuredEvents: Event[];
    recommendedEvents: Event[];
  }>({
    recentJobs: [],
    recentOrgs: [],
    featuredEvents: [],
    recommendedEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get translations
  const t = useTranslations('HomePage');
  const eventsT = useTranslations('Events');
  const orgsT = useTranslations('Organizations');
  const commonT = useTranslations('Common.buttons');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data concurrently from real API
        const results = await Promise.allSettled([
          api.jobs.getAll({ _page: 1, _pageSize: 6 }),
          api.organizations.getAll({ _page: 1, _pageSize: 6 }),
          api.events.getAll({ _page: 1, _pageSize: 6 }),
          api.recommendations.getEvents()
        ]);

        // Process results with proper error handling
        const [jobsResult, orgsResult, eventsResult, recommendedResult] = results;

        setData({
          recentJobs: jobsResult.status === 'fulfilled' && jobsResult.value?.data ? jobsResult.value.data : [],
          recentOrgs: orgsResult.status === 'fulfilled' && orgsResult.value?.data ? orgsResult.value.data : [],
          featuredEvents: eventsResult.status === 'fulfilled' && eventsResult.value?.data ? eventsResult.value.data : [],
          recommendedEvents: recommendedResult.status === 'fulfilled' && recommendedResult.value?.data ? recommendedResult.value.data : [],
        });

        // Log any failed requests for debugging
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const endpoints = ['jobs', 'organizations', 'events', 'recommendations'];
            console.warn(`Failed to fetch ${endpoints[index]}:`, result.reason);
          }
        });

      } catch (err) {
        console.error('Error fetching home page data:', err);
        setError('Unable to load data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Content</h2>
            <p className="text-red-500 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const { recentJobs, recentOrgs, featuredEvents, recommendedEvents } = data;

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSection />

        <main className="font-sans flex-grow">
          {/* Recommended Events Section */}
          {recommendedEvents && recommendedEvents.length > 0 && (
            <section className="pt-16 bg-white">
              <div className="max-w-[1170px] mx-auto px-6">
                <div className="flex justify-between items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {t('recommendedEvents.title')}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {t('recommendedEvents.description')}
                    </p>
                  </div>
                </div>
                {recommendedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        showOrganization={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('recommendedEvents.noData')}</p>
                  </div>
                )}
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
                      {eventsT('featured')}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {t('featuredEvents.description')}
                    </p>
                  </div>
                  <Link
                    to="/events"
                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium shrink-0 group"
                  >
                    {commonT('viewAll')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
                {featuredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        showOrganization={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('featuredEvents.noData')}</p>
                  </div>
                )}
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
                      {t('latestJobs.title')}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {t('latestJobs.description')}
                    </p>
                  </div>
                </div>
                {recentJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                        <p className="text-gray-700 mb-2">{job.organization?.name || 'Organization'}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>📍 {job.location}</p>
                          {(job.salary_min || job.salary_max) && (
                            <p>💰 {job.salary_min ? `${job.salary_min.toLocaleString()}` : ''}{job.salary_max ? ` - ${job.salary_max.toLocaleString()}` : ''} THB</p>
                          )}
                          <p>⏰ {job.job_type}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          {commonT('apply')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('latestJobs.noData')}</p>
                  </div>
                )}
                <div className="flex justify-center mt-10">
                  <Link to="/jobs">
                    <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                      {t('viewMoreJobs')}
                    </Button>
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
                      {orgsT('featured')}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {t('organizations.description')}
                    </p>
                  </div>
                  <Link
                    to="/organizations"
                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium shrink-0 group"
                  >
                    {commonT('viewAll')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
                {recentOrgs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentOrgs.map((org) => (
                      <OrganizationCard 
                        key={org.id} 
                        organization={org}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('organizations.noData')}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default HomePage;
