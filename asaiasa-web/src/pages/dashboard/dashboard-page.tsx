import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/auth-context';
import { Avatar } from '@/components/base/avatar/avatar';
import { LoadingIndicator } from '@/components/application/loading-indicator/loading-indicator';
import Layout from '@/components/layout/layout';
import { Users, Activity, Building, TrendingUp, Award } from 'lucide-react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface CategoryStat {
  amount: number;
  category: { value: number; label: string };
}

interface UserStats {
  CategoryData: CategoryStat[];
  totalEvents: number;
}

const CategoryStatsChart: React.FC<{ CategoryData: CategoryStat[] }> = ({ CategoryData }) => {
  const t = useTranslations('Dashboard');
  
  // Array of colors for categories
  const colors = [
    'bg-blue-500',
    'bg-purple-500', 
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];

  // Calculate total amount for percentage
  const totalAmount = CategoryData.reduce((sum, category) => sum + category.amount, 0);

  return (
    <div className="space-y-6">
      {CategoryData.map((x, index) => {
        const colorClass = colors[index % colors.length];
        const percentage = Math.round((x.amount / totalAmount) * 100);

        return (
          <div key={x.category.label} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium capitalize">{x.category.label}</span>
              <span className="text-gray-500">{x.amount} {t('times')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${colorClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {percentage}%
              </span>
            </div>
          </div>
        );
      })}

      <div className="pt-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            {CategoryData.map((x, index) => {
              const colorClass = colors[index % colors.length];
              return (
                <div
                  key={`legend-${x.category.label}`}
                  className="flex items-center gap-2"
                >
                  <div className={`h-3 w-3 rounded-full ${colorClass}`} />
                  <span className="text-sm capitalize">{x.category.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { userProfile, loading: authLoading } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch user statistics from the backend API
      const response = await api.userStats.getCategoryStats();
      
      if (response.data) {
        const statsData = response.data;
        setUserStats({
          totalEvents: statsData.totalEvents || 0,
          CategoryData: statsData.CategoryData || []
        });
      } else {
        // Fallback to empty data if no stats available
        setUserStats({
          totalEvents: 0,
          CategoryData: []
        });
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      toast.error(t('errorLoadingStats'));
      
      // Set empty data on error
      setUserStats({
        totalEvents: 0,
        CategoryData: []
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (userProfile) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [userProfile, fetchUserStats]);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingIndicator size="lg" />
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userProfile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('accessDenied')}</h2>
            <p className="text-gray-600">{t('pleaseLogin')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { firstName, lastName, email, picUrl } = userProfile;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-[1170px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white shadow-md rounded-lg border border-gray-200">
              <div className="p-6 pb-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    size="xl"
                    src={picUrl}
                    alt={firstName}
                    className="h-20 w-20 ring-4 ring-white shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{firstName} {lastName}</h3>
                    <p className="text-gray-600">{email}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <Users className="h-6 w-6 text-blue-500 mb-2" />
                      <span className="text-2xl font-bold text-gray-900">
                        {userStats?.totalEvents || 0}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t('eventsAttended')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{t('eventTypes.title')}</h3>
                <p className="text-gray-600 mt-1">{t('eventTypes.description')}</p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <LoadingIndicator />
                    <p className="ml-2 text-gray-600">{t('loadingStats')}</p>
                  </div>
                ) : userStats && userStats.CategoryData?.length > 0 ? (
                  <CategoryStatsChart CategoryData={userStats.CategoryData} />
                ) : (
                  <div className="flex justify-center items-center text-gray-500 py-8">
                    <p>{t('noData')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalEvents')}</p>
                <p className="text-2xl font-bold text-gray-900">{userStats?.totalEvents || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('organizations')}</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('contributions')}</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('achievements')}</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
