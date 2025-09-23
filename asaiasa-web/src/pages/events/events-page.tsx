import React, { useState, useEffect } from 'react';
// import { useTranslations } from 'next-intl';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import EventCard from '@/components/common/event-card';
import { api, Event } from '@/services/api';
import { Button } from '@/components/base/buttons/button';

interface EventFilters {
  search: string;
  category: string;
  locationType: string;
  price: string;
}

const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // const t = useTranslations('Events');
  // const commonT = useTranslations('Common');

  // Get filters from URL params
  const [filters, setFilters] = useState<EventFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    locationType: searchParams.get('locationType') || '',
    price: searchParams.get('price') || '',
  });

  // Fetch events based on filters
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: any = {
          _page: currentPage,
          _pageSize: 12,
        };

        // Add filters to params if they exist
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.locationType) params.locationType = filters.locationType;
        if (filters.price) params.price = filters.price;

        const response = await api.events.getAll(params);
        
        if (response && response.data) {
          setEvents(response.data);
          setTotalPages(response.total_page || 1);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters, currentPage]);

  // Update URL params when filters change
  const updateFilters = (newFilters: Partial<EventFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1); // Reset to first page

    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      locationType: '',
      price: '',
    });
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'networking', label: 'Networking' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'environment', label: 'Environment' },
    { value: 'social', label: 'Social' },
  ];

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

  return (
    <Layout>
      <div className="max-w-[1170px] mx-auto px-6 mt-[90px] min-h-[80vh]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover <span className="text-orange-600">Events</span>
          </h1>
          <p className="text-lg text-gray-600">
            Find amazing events and opportunities to make a difference
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search events..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={filters.locationType}
                onChange={(e) => updateFilters({ locationType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Locations</option>
                <option value="online">Online</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <select
                value={filters.price}
                onChange={(e) => updateFilters({ price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <Button
              color="secondary"
              onClick={clearFilters}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Try Again
            </Button>
          </div>
        ) : events.length > 0 ? (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  showOrganization={true}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-8">
                <Button
                  color="secondary"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  color="secondary"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No events found</div>
            <p className="text-sm text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
