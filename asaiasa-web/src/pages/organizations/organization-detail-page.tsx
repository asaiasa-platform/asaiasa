import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useTranslations } from 'next-intl';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaLine } from 'react-icons/fa';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/base/buttons/button';
import { EventCard } from '@/components/common/event-card';
import { api, Organization, Event, Job } from '@/services/api';

type TabType = 'about' | 'jobs' | 'events';

const OrganizationDetailPage: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const t = useTranslations('OrgDetail');
  // const commonT = useTranslations('Common');

  useEffect(() => {
    if (orgId) {
      fetchOrganization();
    }
  }, [orgId]);

  useEffect(() => {
    if (organization && activeTab === 'events' && events.length === 0) {
      fetchEvents();
    } else if (organization && activeTab === 'jobs' && jobs.length === 0) {
      fetchJobs();
    }
  }, [activeTab, organization]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.organizations.getById(orgId!);
      
      if (response && response.data) {
        setOrganization(response.data);
      } else {
        setError('Organization not found');
      }
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError('Failed to load organization details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await api.events.getByOrgId(orgId!, { _page: 1, _pageSize: 10 });
      
      if (response && response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      console.error('Error fetching organization events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await api.jobs.getByOrgId(orgId!, { _page: 1, _pageSize: 10 });
      
      if (response && response.data) {
        setJobs(response.data);
      }
    } catch (err) {
      console.error('Error fetching organization jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const getSocialIcon = (media: string) => {
    const mediaLower = media.toLowerCase();
    const iconProps = { className: "w-5 h-5" };
    
    if (mediaLower.includes('facebook')) return <FaFacebook {...iconProps} />;
    if (mediaLower.includes('instagram')) return <FaInstagram {...iconProps} />;
    if (mediaLower.includes('twitter')) return <FaTwitter {...iconProps} />;
    if (mediaLower.includes('line')) return <FaLine {...iconProps} />;
    
    return <Globe {...iconProps} />;
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-[1170px] mx-auto px-6 mt-[90px] min-h-[80vh]">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !organization) {
    return (
      <Layout>
        <div className="max-w-[1170px] mx-auto px-6 mt-[90px] min-h-[80vh]">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('organizationNotFound')}</h1>
            <p className="text-gray-600 mb-8">{error || t('organizationNotFoundDescription')}</p>
            <Link to="/organizations">
              <Button className="bg-orange-600 hover:bg-orange-700">
                {t('backToOrganizations')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1170px] mx-auto px-6 mt-[90px] sm:mt-[77px] pb-16">
        {/* Header Section */}
        <div className="relative">
          {/* Background Image */}
          <div className="hidden sm:block w-full h-[150px] sm:h-[200px] rounded-[20px] overflow-hidden bg-gradient-to-r from-orange-100 to-orange-200">
            {organization.bgUrl ? (
              <img
                className="w-full h-full object-cover"
                src={organization.bgUrl}
                alt="organization-background"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-orange-300 opacity-50">
                  <Globe className="w-16 h-16" />
                </div>
              </div>
            )}
          </div>
          
          {/* Organization Info */}
          <div className="relative sm:absolute -bottom-[90%] sm:-bottom-[50%] left-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 justify-center items-center">
              <div
                style={{ aspectRatio: "1 / 1" }}
                className="shrink-0 h-[100px] w-[100px] sm:h-[150px] sm:w-[150px] rounded-[20px] overflow-hidden drop-shadow-md bg-white border-4 border-white"
              >
                <img
                  className="w-full h-full object-cover"
                  src={organization.picUrl || "/logo-2.png"}
                  alt={organization.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/logo-2.png";
                  }}
                />
              </div>
              <div className="flex flex-col sm:mt-11 text-center sm:text-left">
                <h1 className="text-lg sm:text-2xl font-medium line-clamp-1 mb-1">
                  {organization.name}
                </h1>
                <p className="text-sm sm:text-base font-light line-clamp-2 text-gray-600 mb-2">
                  {organization.headline}
                </p>
                {(organization.province || organization.country) && (
                  <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500 gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {organization.province && organization.country 
                        ? `${organization.province}, ${organization.country}`
                        : organization.province || organization.country}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-[10px] sm:mt-[120px] w-full">
          <div className="flex justify-center sm:justify-start border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-4 px-1 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('about')}
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`pb-4 px-1 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'jobs'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('jobs')}
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`pb-4 px-1 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'events'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('events')}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex flex-col gap-[60px] mt-8 min-h-[50vh]">
          {activeTab === 'about' && (
            <div className="flex flex-col gap-8">
              {/* Organization Details Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                  {t('detail')}
                </h2>
                
                <div className="space-y-6">
                  {/* Business Type / Industries */}
                  {organization.industries && organization.industries.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                        {t('businessType')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {organization.industries.map((industry: any) => (
                          <span
                            key={industry.id}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {industry.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specialty */}
                  {organization.specialty && (
                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                        {t('specialty')}
                      </h4>
                      <p className="text-base text-gray-900 leading-relaxed">
                        {organization.specialty}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  {organization.description && (
                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                        {t('description')}
                      </h4>
                      <div className="prose prose-sm max-w-none">
                        <pre className="font-prompt text-base font-normal whitespace-pre-wrap break-words text-gray-700 leading-relaxed">
                          {organization.description}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                  {t('contactInfo')}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Details */}
                  <div className="space-y-6">
                    {organization.email && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Mail className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-1">{t('emailAddress')}</p>
                          <a 
                            href={`mailto:${organization.email}`}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            {organization.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {organization.phone && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Phone className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-1">{t('phoneNumber')}</p>
                          <a 
                            href={`tel:${organization.phone}`}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            {organization.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {(organization.province || organization.country) && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-1">{t('locationLabel')}</p>
                          <p className="text-gray-900">
                            {organization.province && organization.country 
                              ? `${organization.province}, ${organization.country}`
                              : organization.province || organization.country}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Social Media Contacts */}
                    {organization.organizationContacts && organization.organizationContacts.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          {t('otherChannels')}
                        </h4>
                        <div className="flex flex-col gap-3">
                          {organization.organizationContacts.map((contact: any, index: number) => (
                            <a
                              key={index}
                              href={contact.mediaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300 group"
                            >
                              <div className="flex-shrink-0">
                                {getSocialIcon(contact.media)}
                              </div>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                {contact.media}
                              </span>
                              <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Map Section */}
                  <div className="flex flex-col gap-4">
                    {organization.latitude !== 0 && organization.longitude !== 0 ? (
                      <div className="rounded-lg bg-gray-100 h-[300px] flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">{t('mapIntegrationComingSoon')}</p>
                          <p className="text-sm text-gray-400 mt-1">{t('interactiveLocationMap')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-gray-50 h-[300px] flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-400 font-medium">{t('locationNotAvailable')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg sm:text-xl font-semibold">{t('jobListings')}</h2>
              {loadingJobs ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-lg mb-2">{job.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{job.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{(job as any).employmentType}</span>
                        {(job as any).salary && <span>{(job as any).salary}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('noJobs')}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg sm:text-xl font-semibold">{t('eventListings')}</h2>
              {loadingEvents ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showOrganization={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('noEvents')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationDetailPage;
