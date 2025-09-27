import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslations } from 'next-intl';
import { Plus, Building2, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/inputs/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/cards/card';
import Layout from '@/components/layout/layout';
import { api, Organization } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

const MyOrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { isAuth, userProfile } = useAuth();
  const t = useTranslations('Organizations');
  const commonT = useTranslations('Common.buttons');

  useEffect(() => {
    if (isAuth && userProfile) {
      fetchMyOrganizations();
    }
  }, [isAuth, userProfile]);

  useEffect(() => {
    // Filter organizations based on search term
    const filtered = organizations.filter(org => {
      if (!org) return false;
      
      const name = org.name || '';
      const description = org.description || '';
      const specialty = org.specialty || '';
      const headline = org.headline || '';
      
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        headline.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredOrganizations(filtered);
  }, [organizations, searchTerm]);

  const fetchMyOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.organizations.getMyOrganizations();
      
      if (response.data) {
        setOrganizations(response.data);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(t('loadingOrganizations'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrganization = async (orgId: number) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await api.organizations.delete(orgId.toString());
      fetchMyOrganizations(); // Refresh the list
    } catch (err) {
      console.error('Error deleting organization:', err);
      setError(t('deleteError'));
    }
  };

  if (!isAuth || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to view your organizations.</p>
            <Link to="/login">
              <Button>{commonT('login')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('myOrganizations')}
              </h1>
              <p className="mt-2 text-gray-600">
                {t('organizationList')} ({filteredOrganizations.length})
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link to="/organizations/create">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {t('createButton')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <span className="ml-2 text-gray-600">{t('loadingOrganizations')}</span>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchMyOrganizations} variant="outline">
                {t('tryAgain')}
              </Button>
            </CardContent>
          </Card>
        ) : filteredOrganizations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {organizations.length === 0 ? t('noOrganizations') : 'No matching organizations'}
              </h3>
              <p className="text-gray-600 mb-6">
                {organizations.length === 0 
                  ? 'Get started by creating your first organization.'
                  : 'Try adjusting your search terms.'
                }
              </p>
              {organizations.length === 0 && (
                <Link to="/organizations/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('createButton')}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <Card key={org.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {org.picUrl ? (
                        <img
                          src={org.picUrl}
                          alt={org.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-orange-600" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                        <p className="text-sm text-gray-600">{org.headline || 'No headline provided'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Link to={`/organizations/${org.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrganization(org.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {org.description || 'No description provided'}
                  </p>
                  
                  {/* Organization Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{org.numberOfEvents || 0}</div>
                      <div className="text-xs text-gray-500">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{org.numberOfOpenJobs || 0}</div>
                      <div className="text-xs text-gray-500">Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{org.numberOfMembers || 0}</div>
                      <div className="text-xs text-gray-500">Members</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {org.specialty && (
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{t('organizationSpecialty')}:</span> {org.specialty}
                      </div>
                    )}
                    <Link to={`/organizations/${org.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrganizationsPage;
