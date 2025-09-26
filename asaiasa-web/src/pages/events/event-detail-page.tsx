import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
// import { useTranslations } from 'next-intl';
import { IoCalendarSharp, IoLocationSharp, IoTimeOutline } from 'react-icons/io5';
import { FaFacebook, FaInstagram, FaTwitter, FaLine } from 'react-icons/fa';
import parse, { HTMLReactParserOptions, Element, DOMNode, domToReact } from 'html-react-parser';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/base/buttons/button';
import { api, Event } from '@/services/api';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations('EventDetail');
  const commonT = useTranslations('Common');

  // HTML parsing options for content
  const htmlParseOptions: HTMLReactParserOptions = {
    replace(domNode) {
      if (domNode instanceof Element && domNode.attribs) {
        const { name, children } = domNode;

        if (name === 'ul') {
          return (
            <ul className="list-disc ml-5 mb-4">
              {domToReact(children as DOMNode[], htmlParseOptions)}
            </ul>
          );
        }

        if (name === 'ol') {
          return (
            <ol className="list-decimal ml-5 mb-4">
              {domToReact(children as DOMNode[], htmlParseOptions)}
            </ol>
          );
        }

        if (name === 'p') {
          return (
            <p className="mb-4">{domToReact(children as DOMNode[], htmlParseOptions)}</p>
          );
        }

        if (name === 'img') {
          return (
            <img 
              {...domNode.attribs}
              className="inline-block max-w-[20px] h-auto mx-1"
              style={{ width: '16px', height: 'auto' }}
            />
          );
        }
      }
    },
  };

  // Function to render social media icons
  const getSocialIcon = (media: string) => {
    const mediaLower = media.toLowerCase();
    const iconProps = { className: "w-5 h-5" };
    
    if (mediaLower.includes('facebook')) return <FaFacebook {...iconProps} />;
    if (mediaLower.includes('instagram')) return <FaInstagram {...iconProps} />;
    if (mediaLower.includes('twitter')) return <FaTwitter {...iconProps} />;
    if (mediaLower.includes('line')) return <FaLine {...iconProps} />;
    
    // Default icon for unknown social media
    return <span className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white">?</span>;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError('Event ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.events.getById(eventId);
        if (response && response.data) {
          setEvent(response.data);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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

  if (error || !event) {
    return (
      <Layout>
        <div className="max-w-[1170px] mx-auto px-6 mt-[90px] min-h-[80vh]">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('eventNotFound')}</h1>
            <p className="text-gray-600 mb-8">{error || t('eventNotFoundDescription')}</p>
            <Link to="/events">
              <Button className="bg-orange-600 hover:bg-orange-700">
                {t('backToEvents')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="font-prompt relative h-full w-full mt-[60px]">
        {/* Hero Section with Event Image */}
        <div className="relative flex justify-center items-center h-[425px]">
          {event.picUrl && (
            <img
              className="absolute blur-md opacity-45 h-full w-full object-cover duration-100 -z-10 bg-white"
              src={event.picUrl}
              alt="event-blur"
            />
          )}
          
          {/* Event Info Card */}
          <div className="flex justify-center items-center h-full lg:w-[90%] xl:w-[80%] mx-auto px-4 py-4 drop-shadow-lg">
            <div className="hidden md:flex flex-col gap-3 justify-center h-full md:max-w-[50%] rounded-l-[10px] px-3 md:px-6 lg:px-10 md:bg-white">
              {/* Organization Info */}
              {event.organization && (
                <div className="flex justify-start items-center gap-2">
                  <Link
                    to={`/organizations/${event.organization.id}`}
                    className="inline-flex justify-start items-center gap-2"
                  >
                    {event.organization.picUrl && (
                      <div
                        className="inline-flex h-auto max-w-[40px] overflow-hidden rounded-full"
                        style={{ aspectRatio: "1 / 1" }}
                      >
                        <img
                          className="shrink-0 h-full w-full object-cover"
                          src={event.organization.picUrl}
                          width={60}
                          height={60}
                          alt="org-profile"
                        />
                      </div>
                    )}
                    <span className="line-clamp-1 text-base hover:text-orange-600">
                      {event.organization.name}
                    </span>
                  </Link>
                </div>
              )}

              {/* Event Title */}
              <h1 className="font-medium text-2xl lg:text-3xl line-clamp-2">
                {event.name}
              </h1>

              {/* Event Details */}
              <div className="inline-flex flex-col justify-start items-start gap-4">
                <div className="flex justify-start items-center flex-row gap-3">
                  <IoCalendarSharp className="shrink-0 text-orange-600 text-lg" />
                  <p className="line-clamp-2 font-normal sm:text-base md:text-lg">
                    {formatDate(event.startDate)}
                    {event.endDate && event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                  </p>
                </div>
                
                <div className="inline-flex justify-start items-center flex-row gap-3">
                  <IoTimeOutline className="shrink-0 text-orange-600 text-lg" />
                  <p className="line-clamp-2 font-normal sm:text-base md:text-lg">
                    {formatTime(event.startTime)}
                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                  </p>
                </div>
                
                <div className="inline-flex justify-start items-center flex-row gap-3">
                  <IoLocationSharp className="shrink-0 text-orange-600 text-lg" />
                  <p className="line-clamp-2 font-normal sm:text-base md:text-lg">
                    {event.locationType === 'online' ? t('onlineEvent') : event.locationName}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Image */}
            {event.picUrl && (
              <div className="shrink-0 h-full md:rounded-r-[10px] overflow-hidden">
                <div className="h-full rounded-[5px] md:rounded-none drop-shadow-md md:drop-shadow-none overflow-hidden">
                  <img
                    className="object-cover h-full w-auto"
                    src={event.picUrl}
                    width={300}
                    height={500}
                    alt="event"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Event Info */}
        <div className="md:hidden w-full mt-[15px] px-3">
          <div className="flex flex-col gap-3 justify-center items-center">
            {/* Organization Info */}
            {event.organization && (
              <div className="flex justify-start items-center gap-2">
                <Link
                  to={`/organizations/${event.organization.id}`}
                  className="inline-flex justify-start items-center gap-2"
                >
                  {event.organization.picUrl && (
                    <div
                      className="inline-flex h-auto max-w-[40px] overflow-hidden rounded-full"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      <img
                        className="shrink-0 h-full w-full object-cover"
                        src={event.organization.picUrl}
                        width={60}
                        height={60}
                        alt="org-profile"
                      />
                    </div>
                  )}
                  <span className="line-clamp-1 text-base hover:text-orange-600">
                    {event.organization.name}
                  </span>
                </Link>
              </div>
            )}

            <h1 className="font-medium text-lg line-clamp-2 text-center">{event.name}</h1>

            <div className="inline-flex flex-col justify-start items-center gap-2">
              <div className="flex justify-start items-center flex-row gap-3">
                <IoCalendarSharp className="shrink-0 text-orange-600 text-base" />
                <p className="line-clamp-2 font-normal text-sm">
                  {formatDate(event.startDate)}
                </p>
              </div>
              
              <div className="inline-flex justify-start items-center flex-row gap-3">
                <IoTimeOutline className="shrink-0 text-orange-600 text-lg" />
                <p className="line-clamp-2 font-normal text-sm">
                  {formatTime(event.startTime)}
                </p>
              </div>
              
              <div className="inline-flex justify-start items-center flex-row gap-3">
                <IoLocationSharp className="shrink-0 text-orange-600 text-lg" />
                <p className="line-clamp-2 font-normal text-sm">
                  {event.locationType === 'online' ? t('onlineEvent') : event.locationName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="lg:w-[90%] xl:w-[80%] mx-auto px-3 md:px-10 lg:px-14">
          <h2 className="font-semibold text-xl md:text-2xl mt-[32px]">
            {t('eventDetails')}
          </h2>
          
          <div className="w-full mt-[8px] mb-[16px]" />
          
          <div className="flex flex-col gap-[32px] md:gap-[4%] md:flex-row justify-between">
            <div className="flex flex-col gap-[30px] w-full">
              {/* Event Description */}
              {event.content && (
                <div className="flex flex-col gap-[10px]">
                  <h3 className="font-semibold text-xl md:text-2xl">{t('description')}</h3>
                  <div className="font-prompt text-base font-normal whitespace-pre-wrap break-words prose max-w-none">
                    {parse(event.content, htmlParseOptions)}
                  </div>
                </div>
              )}
            </div>

            {/* Event Info & Registration Panel */}
            <div className="shrink-0 md:w-[35%]">
              <div className="md:sticky top-[80px] flex flex-col gap-6 w-full h-auto p-6 border border-gray-200 rounded-xl shadow-lg bg-white">
                
                {/* Registration Section */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-2">
                    {t('register')}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {event.registerLink ? (
                      <a 
                        href={event.registerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                          {t('registerForEvent')}
                        </Button>
                      </a>
                    ) : (
                      <Button 
                        className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
                        disabled
                      >
                        {t('registrationNotAvailable')}
                      </Button>
                    )}
                    <Link to="/events">
                      <Button color="secondary" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg">
                        {t('backToEvents')}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Event Categories */}
                {event.categories && event.categories.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                      {t('categories')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {event.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-200"
                        >
                          {category.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Event Information */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                    {t('information')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600">{t('audience')}</span>
                      <span className="text-sm text-gray-900 capitalize font-medium">{event.audience}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-50">
                      <span className="text-sm font-medium text-gray-600">{t('priceType')}</span>
                      <span className="text-sm text-gray-900 capitalize font-medium">
                        {(event.price === 'free' || event.priceType === 'free') ? (
                          <span className="text-green-600 font-semibold">{t('free')}</span>
                        ) : (
                          <span className="text-blue-600 font-semibold">{t('paid')}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-50">
                      <span className="text-sm font-medium text-gray-600">{t('locationType')}</span>
                      <span className="text-sm text-gray-900 capitalize font-medium">{event.locationType}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-50">
                      <span className="text-sm font-medium text-gray-600">{t('province')}</span>
                      <span className="text-sm text-gray-900 font-medium">{event.province || t('notSpecified')}</span>
                    </div>
                    {event.status && (
                      <div className="flex justify-between items-center py-2 border-t border-gray-50">
                        <span className="text-sm font-medium text-gray-600">{t('status')}</span>
                        <span className="text-sm text-gray-900 capitalize font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.status === 'published' ? 'bg-green-100 text-green-700' :
                            event.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {event.status}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Channels */}
                {event.contactChannels && event.contactChannels.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                      {t('contactChannels')}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {event.contactChannels.map((contact, index) => (
                        <a
                          key={index}
                          href={contact.mediaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
                        >
                          {getSocialIcon(contact.media)}
                          <span className="text-sm font-medium text-gray-700">{contact.media}</span>
                          <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                {event.locationName && event.locationType === 'onsite' && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                      {t('location')}
                    </h4>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <IoLocationSharp className="text-orange-500 text-lg mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 font-medium">{event.locationName}</p>
                    </div>
                    {event.latitude !== 0 && event.longitude !== 0 && (
                      <div className="w-full rounded-lg bg-gray-100 overflow-hidden h-32 flex items-center justify-center border border-gray-200">
                        <p className="text-sm text-gray-500">{t('mapComingSoon')}</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;
