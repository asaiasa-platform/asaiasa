import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/base/buttons/button';
import { OrganizationCard } from '@/components/common/organization-card';
import { api, Organization } from '@/services/api';

const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const t = useTranslations('Organizations');

  const pageSize = 12;

  useEffect(() => {
    const query = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    
    setSearchQuery(query);
    setCurrentPage(page);
    
    fetchOrganizations(page, query);
  }, [searchParams]);

  const fetchOrganizations = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        _page: page,
        _pageSize: pageSize,
      };
      
      if (search.trim()) {
        params.query = search.trim();
      }
      
      const response = await api.organizations.getAll(params);
      
      if (response && response.data) {
        setOrganizations(response.data);
        setTotalPages(response.total_page || 1);
        setTotalData(response.total_data || 0);
      } else {
        setOrganizations([]);
        setTotalPages(1);
        setTotalData(0);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to load organizations');
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    params.set('page', '1');
    navigate(`/organizations?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    params.set('page', page.toString());
    navigate(`/organizations?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="font-prompt mx-auto px-6 flex-grow mb-16">
          {/* Header */}
          <div className="text-center font-semibold text-2xl border-b-2 pb-[11px] mt-[100px]">
            <span className="text-black">{t('search.prefix')}</span>
            <span className="text-orange-600"> "{t('search.highlight')}" </span>
            <span className="text-black">{t('search.suffix')}</span>
          </div>

          {/* Search Section */}
          <div className="flex justify-between items-center gap-5 w-full mt-[25px]">
            <div className="flex-grow bg-white relative max-w-[455px] border border-gray-300 rounded-full">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow h-[48px] w-full px-4 py-2 placeholder:text-gray-400 placeholder:font-light text-gray-700 bg-transparent outline-none rounded-full"
              />
              <div className="bg-white absolute top-0 rounded-r-full pr-1 right-0 h-[48px] w-[55px] flex items-center justify-end">
                <button 
                  onClick={handleSearch}
                  className="bg-orange-600 hover:bg-orange-700 transition-all duration-200 flex justify-center items-center h-[40px] w-[40px] rounded-full"
                >
                  <Search className="h-[18px] w-[18px] text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && (
            <div className="mt-6 text-gray-600">
              <p className="text-sm">
                {searchQuery ? (
                  <>
                    {t('searchResults', { query: searchQuery, count: totalData })}
                  </>
                ) : (
                  <>
                    {t('totalOrganizations', { count: totalData })}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Organizations Grid */}
          <div className="flex flex-col mt-8">
            {error ? (
              <div className="flex flex-col items-center justify-center mt-[100px] mb-[150px] text-center">
                <p className="text-2xl font-medium text-red-600 mb-4">{error}</p>
                <Button onClick={() => fetchOrganizations(currentPage, searchQuery)}>
                  {t('tryAgain')}
                </Button>
              </div>
            ) : organizations && organizations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {organizations.map((org) => (
                    <OrganizationCard
                      key={org.id}
                      organization={org}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2"
                    >
                      {t('previous')}
                    </Button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            onClick={() => handlePageChange(pageNum)}
                            className="px-3 py-2 min-w-[40px]"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2"
                    >
                      {t('next')}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center mt-[100px] mb-[150px] text-center">
                <p className="text-2xl font-medium text-gray-600 mb-2">
                  {searchQuery ? t('searchNotFound') : t('notFound')}
                </p>
                {searchQuery && (
                  <p className="text-gray-500 mb-4">
                    {t('searchSuggestion')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationsPage;
