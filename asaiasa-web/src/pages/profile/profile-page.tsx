import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/auth-context';
import { Avatar } from '@/components/base/avatar/avatar';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Label } from '@/components/base/input/label';
import { LoadingIndicator } from '@/components/application/loading-indicator/loading-indicator';
import Layout from '@/components/layout/layout';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Globe, Shield, Calendar, Activity, Users, Building } from 'lucide-react';

interface UserStats {
  eventsAttended: number;
  organizationsFollowed: number;
  totalContributions: number;
}

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const { userProfile, loading: authLoading, setAuthState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    eventsAttended: 0,
    organizationsFollowed: 0,
    totalContributions: 0
  });
  
  // Form state for editing
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: ''
  });

  // Initialize form data when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setEditForm({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        language: userProfile.language || 'en'
      });
    }
  }, [userProfile]);

  // Mock function to fetch user statistics
  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchUserStats = async () => {
      try {
        // Mock data - replace with actual API call
        setUserStats({
          eventsAttended: 12,
          organizationsFollowed: 5,
          totalContributions: 24
        });
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    if (userProfile) {
      fetchUserStats();
    }
  }, [userProfile]);

  const handleInputChange = (field: string) => (value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Basic validation
      if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
        toast.error(t('requiredField'));
        return;
      }

      if (!editForm.email.includes('@')) {
        toast.error(t('invalidEmail'));
        return;
      }

      // Call the API to update the profile
      const result = await api.user.updateProfile(editForm);
      
      // Check if the update was successful
      if (!result || !result.data) {
        throw new Error('Failed to update profile');
      }
      
      // Update auth state to reflect changes
      await setAuthState();
      
      toast.success(t('updateSuccess'));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      // Provide more specific error messages
      let errorMessage = t('updateError');
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = 'Please log in again to update your profile';
        } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
          errorMessage = 'Invalid profile data. Please check your inputs.';
        } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timeout. Please check your connection.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (userProfile) {
      setEditForm({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        language: userProfile.language || 'en'
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('profileNotFound')}</h2>
            <p className="text-gray-600">{t('pleaseLogin')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <Avatar
                  size="xl"
                  src={userProfile.picUrl}
                  alt={`${userProfile.firstName} ${userProfile.lastName}`}
                  className="h-20 w-20 ring-4 ring-white shadow-lg"
                />
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userProfile.firstName} {userProfile.lastName}
                  </h1>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>{userProfile.role}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                {!isEditing ? (
                  <Button
                    color="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    {t('editProfile')}
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button
                      color="secondary"
                      onClick={handleCancel}
                      isDisabled={isSaving}
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleSave}
                      isDisabled={isSaving}
                    >
                      {isSaving ? t('saving') : t('saveChanges')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('personalInfo')}</h2>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <Label htmlFor="firstName">{t('firstName')}</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editForm.firstName}
                        onChange={handleInputChange('firstName')}
                        className="mt-1"
                        isDisabled={isSaving}
                      />
                    ) : (
                      <div className="mt-1 flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{userProfile.firstName}</span>
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label htmlFor="lastName">{t('lastName')}</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editForm.lastName}
                        onChange={handleInputChange('lastName')}
                        className="mt-1"
                        isDisabled={isSaving}
                      />
                    ) : (
                      <div className="mt-1 flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{userProfile.lastName}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">{t('email')}</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleInputChange('email')}
                        className="mt-1"
                        isDisabled={isSaving}
                      />
                    ) : (
                      <div className="mt-1 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{userProfile.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">{t('phone')}</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={handleInputChange('phone')}
                        className="mt-1"
                        isDisabled={isSaving}
                      />
                    ) : (
                      <div className="mt-1 flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{userProfile.phone || t('notProvided')}</span>
                      </div>
                    )}
                  </div>

                  {/* Language */}
                  <div>
                    <Label htmlFor="language">{t('language')}</Label>
                    <div className="mt-1 flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {userProfile.language === 'th' ? t('languageThai') : t('languageEnglish')}
                      </span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div>
                    <Label>{t('lastUpdated')}</Label>
                    <div className="mt-1 flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{formatDate(userProfile.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('statistics')}</h2>
              </div>
              <div className="px-6 py-6">
                <div className="space-y-6">
                  {/* Events Attended */}
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
                      <Activity className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{userStats.eventsAttended}</div>
                    <div className="text-sm text-gray-600">{t('eventsAttended')}</div>
                  </div>

                  {/* Organizations Followed */}
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{userStats.organizationsFollowed}</div>
                    <div className="text-sm text-gray-600">{t('organizationsFollowed')}</div>
                  </div>

                  {/* Total Contributions */}
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{userStats.totalContributions}</div>
                    <div className="text-sm text-gray-600">{t('totalContributions')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
