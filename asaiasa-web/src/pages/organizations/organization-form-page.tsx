import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslations } from 'next-intl';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { 
  Building2, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  Loader2,
  ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/inputs/input';
import { Textarea } from '@/components/base/inputs/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/cards/card';
import { Label } from '@/components/base/labels/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/selects/select';
import { Checkbox } from '@/components/base/checkboxes/checkbox';
import Layout from '@/components/layout/layout';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

interface OrganizationFormData {
  name: string;
  email: string;
  phone: string;
  headline: string;
  specialty: string;
  description: string;
  address: string;
  province: string;
  country: string;
  latitude: string;
  longitude: string;
  picUrl: string;
  bgUrl: string;
  organizationContacts: Array<{
    media: string;
    mediaLink: string;
  }>;
  industries: Array<{
    label: string;
    value: number;
  }>;
}

const OrganizationFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [isRemote, setIsRemote] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  
  const { isAuth, userProfile } = useAuth();
  const t = useTranslations('Organizations');
  const commonT = useTranslations('Common.buttons');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<OrganizationFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      headline: '',
      specialty: '',
      description: '',
      address: '',
      province: '',
      country: 'TH',
      latitude: '',
      longitude: '',
      picUrl: '',
      bgUrl: '',
      organizationContacts: [{ media: '', mediaLink: '' }],
      industries: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'organizationContacts'
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchOrganization(id);
    }
  }, [isEdit, id]);

  const fetchOrganization = async (orgId: string) => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const response = await api.organizations.getById(orgId);
      
      if (response.data) {
        const org = response.data;
        
        // Populate form with organization data
        reset({
          name: org.name || '',
          email: org.email || '',
          phone: org.phone || '',
          headline: org.headline || '',
          specialty: org.specialty || '',
          description: org.description || '',
          address: org.address || '',
          province: org.province || '',
          country: org.country || 'TH',
          latitude: org.latitude?.toString() || '',
          longitude: org.longitude?.toString() || '',
          picUrl: org.picUrl || '',
          bgUrl: org.bgUrl || '',
          organizationContacts: org.organizationContacts?.length > 0 
            ? org.organizationContacts 
            : [{ media: '', mediaLink: '' }],
          industries: org.industries || []
        });

        // Set preview images
        if (org.picUrl) setLogoPreview(org.picUrl);
        if (org.bgUrl) setBackgroundPreview(org.bgUrl);
        
        // Set remote status
        setIsRemote(!org.address);
      }
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError(t('loadingOrganizations'));
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare form data
      const formData = new FormData();
      
      // Convert form data to the expected format
      const orgData = {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        industries: data.industries.map(industry => industry.value)
      };

      // Add the organization data as JSON
      formData.append('org', JSON.stringify(orgData));

      // Add images if they exist
      if (logoPreview && logoPreview.startsWith('data:')) {
        // Convert base64 to file
        const logoBlob = await fetch(logoPreview).then(r => r.blob());
        formData.append('image', logoBlob, 'logo.png');
      }

      if (backgroundPreview && backgroundPreview.startsWith('data:')) {
        // Convert base64 to file
        const bgBlob = await fetch(backgroundPreview).then(r => r.blob());
        formData.append('background_image', bgBlob, 'background.png');
      }

      if (isEdit && id) {
        // Update organization
        await api.organizations.update(id, formData);
        navigate('/my-organizations');
      } else {
        // Create organization
        await api.organizations.create(formData);
        navigate('/my-organizations');
      }
    } catch (err) {
      console.error('Error saving organization:', err);
      setError(isEdit ? t('updateError') : t('createError'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (type: 'logo' | 'background') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          if (type === 'logo') {
            setLogoPreview(result);
            setValue('picUrl', result);
          } else {
            setBackgroundPreview(result);
            setValue('bgUrl', result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoteToggle = () => {
    setIsRemote(!isRemote);
    if (!isRemote) {
      // Clear location fields when switching to remote
      setValue('address', '');
      setValue('province', '');
      setValue('latitude', '');
      setValue('longitude', '');
    }
  };

  if (!isAuth || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to manage organizations.</p>
            <Button onClick={() => navigate('/login')}>{commonT('login')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
          <span className="text-gray-600">{t('loadingOrganizations')}</span>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              color="secondary"
              onClick={() => navigate('/my-organizations')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? t('editOrganization') : t('createOrganization')}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit 
              ? 'Update your organization information'
              : 'Create a new organization to start managing events and jobs'
            }
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <div className="text-red-800">{error}</div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Background Image */}
              <div>
                <Label>{t('organizationBackground')}</Label>
                {backgroundPreview ? (
                  <div className="relative mt-2">
                    <img
                      src={backgroundPreview}
                      alt="Background"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      color="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageUpload('background')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change
                    </Button>
                  </div>
                ) : (
                  <div
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
                    onClick={() => handleImageUpload('background')}
                  >
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to upload background image</p>
                    <p className="text-sm text-gray-500">Recommended: 1200x300px</p>
                  </div>
                )}
              </div>

              {/* Logo */}
              <div>
                <Label>{t('organizationLogo')}</Label>
                {logoPreview ? (
                  <div className="relative mt-2 w-32">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      color="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageUpload('logo')}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="mt-2 w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                    onClick={() => handleImageUpload('logo')}
                  >
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600 text-center">Upload Logo</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">{t('organizationName')} *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: t('required') })}
                    placeholder="Enter organization name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">{t('organizationEmail')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: t('required'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('invalidEmail')
                      }
                    })}
                    placeholder="organization@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">{t('organizationPhone')}</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="0812345678"
                  />
                </div>

                <div>
                  <Label htmlFor="headline">{t('organizationHeadline')} *</Label>
                  <Input
                    id="headline"
                    {...register('headline', { required: t('required') })}
                    placeholder="Brief description of your organization"
                  />
                  {errors.headline && (
                    <p className="mt-1 text-sm text-red-600">{errors.headline.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="specialty">{t('organizationSpecialty')} *</Label>
                <Input
                  id="specialty"
                  {...register('specialty', { required: t('required') })}
                  placeholder="What does your organization specialize in?"
                />
                {errors.specialty && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialty.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">{t('organizationDescription')} *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register('description', { required: t('required') })}
                  placeholder="Detailed description of your organization"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRemote"
                  checked={isRemote}
                  onCheckedChange={handleRemoteToggle}
                />
                <Label htmlFor="isRemote">This is a remote/online organization</Label>
              </div>

              {!isRemote && (
                <>
                  <div>
                    <Label htmlFor="address">{t('organizationAddress')} *</Label>
                    <Textarea
                      id="address"
                      rows={3}
                      {...register('address', { required: !isRemote ? t('required') : false })}
                      placeholder="Full address of your organization"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="province">{t('organizationProvince')} *</Label>
                      <Controller
                        name="province"
                        control={control}
                        rules={{ required: !isRemote ? t('required') : false }}
                        render={({ field }) => (
                          <Select onChange={(e) => field.onChange(e.target.value)} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bangkok">Bangkok</SelectItem>
                              <SelectItem value="chiangmai">Chiang Mai</SelectItem>
                              <SelectItem value="phuket">Phuket</SelectItem>
                              {/* Add more provinces as needed */}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.province && (
                        <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country">{t('organizationCountry')} *</Label>
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: !isRemote ? t('required') : false }}
                        render={({ field }) => (
                          <Select onChange={(e) => field.onChange(e.target.value)} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TH">Thailand</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        {...register('latitude')}
                        placeholder="13.7563"
                      />
                    </div>

                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        {...register('longitude')}
                        placeholder="100.5018"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Channels */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('contactChannels')}</CardTitle>
                <Button
                  type="button"
                  color="secondary"
                  size="sm"
                  onClick={() => append({ media: '', mediaLink: '' })}
                  disabled={fields.length >= 5}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addContactChannel')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex space-x-4 items-start">
                  <div className="flex-1">
                    <Label>Platform</Label>
                    <Controller
                      name={`organizationContacts.${index}.media`}
                      control={control}
                      render={({ field: controllerField }) => (
                        <Select 
                          onChange={(e) => controllerField.onChange(e.target.value)} 
                          value={controllerField.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="line">Line</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>URL</Label>
                    <Input
                      {...register(`organizationContacts.${index}.mediaLink`)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    type="button"
                    color="secondary"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              color="secondary"
              onClick={() => navigate('/my-organizations')}
            >
              {commonT('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex items-center space-x-2"
            >
              {(isSubmitting || loading) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? t('saveButton') : t('createButton')}</span>
                </>
              )}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationFormPage;
