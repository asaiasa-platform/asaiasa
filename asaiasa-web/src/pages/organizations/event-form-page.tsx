import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslations } from 'next-intl';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { CloudUpload, Loader2, Plus, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/inputs/input';
import { Textarea } from '@/components/base/inputs/textarea';
import { Label } from '@/components/base/labels/label';
import { Select } from '@/components/base/selects/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/base/dialogs/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/base/alerts/alert-dialog';
import { api, EventFormValues } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

const EventFormPage: React.FC = () => {
  const { orgId, eventId } = useParams<{ orgId: string; eventId?: string }>();
  const navigate = useNavigate();
  const { isAuth, userProfile } = useAuth();
  const t = useTranslations('EventManagement');
  
  const isEditing = !!eventId;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);

  const form = useForm<EventFormValues>({
    defaultValues: {
      picUrl: '',
      name: '',
      content: '',
      locationName: '',
      locationType: '',
      audience: '',
      province: '',
      country: 'TH',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      latitude: '',
      longitude: '',
      priceType: '',
      registerLink: '',
      status: 'draft',
      categories: [],
      contactChannels: [{ media: '', mediaLink: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contactChannels',
  });

  const isRemote = form.watch('locationType') === 'online';

  useEffect(() => {
    if (!isAuth || !userProfile) {
      navigate('/login');
      return;
    }

    fetchCategories();
    
    if (isEditing && eventId) {
      fetchEvent();
    } else {
      setInitialLoading(false);
    }
  }, [isAuth, userProfile, isEditing, eventId]);

  const fetchCategories = async () => {
    try {
      const response = await api.events.getCategories();
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchEvent = async () => {
    try {
      setInitialLoading(true);
      const response = await api.organizations.events.getById(orgId!, eventId!);
      
      if (response && response.data) {
        const event = response.data;
        
        // Set form values
        form.reset({
          picUrl: event.picUrl || '',
          name: event.name || '',
          content: event.content || '',
          locationName: event.locationName || '',
          locationType: event.locationType || '',
          audience: event.audience || '',
          province: event.province || '',
          country: event.country || 'TH',
          startDate: event.startDate || '',
          endDate: event.endDate || '',
          startTime: event.startTime || '',
          endTime: event.endTime || '',
          latitude: event.latitude?.toString() || '',
          longitude: event.longitude?.toString() || '',
          priceType: event.priceType || '',
          registerLink: event.registerLink || '',
          status: event.status || 'draft',
          categories: event.categories || [],
          contactChannels: event.contactChannels?.length ? event.contactChannels : [{ media: '', mediaLink: '' }],
        });
        
        setPosterPreview(event.picUrl || null);
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event details');
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file size (max 10MB) and type
      if (file.size > 10 * 1024 * 1024) {
        form.setError('picUrl', {
          type: 'manual',
          message: 'File size must be less than 10MB',
        });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        form.setError('picUrl', {
          type: 'manual',
          message: 'Only JPEG and PNG files are allowed',
        });
        return;
      }

      form.clearErrors('picUrl');

      const reader = new FileReader();
      reader.onload = () => {
        const fileString = reader.result as string;
        form.setValue('picUrl', fileString);
        setPosterPreview(fileString);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPoster = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png';
    input.onchange = (e: Event) =>
      handlePosterChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      setLoading(true);
      setError(null);

      // Create FormData
      const formData = new FormData();

      // Handle image
      if (data.picUrl && data.picUrl.startsWith('data:')) {
        const uniqueFilename = `event_${Date.now()}.png`;
        const imageBlob = base64ToBlob(data.picUrl, 'image/png');
        formData.append('image', imageBlob, uniqueFilename);
      }

      // Prepare event data
      const eventData = {
        ...data,
        latitude: data.latitude ? Number(data.latitude) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
      };

      // Remove picUrl from the JSON data since we're sending it as a file
      const { picUrl, ...jsonData } = eventData;
      formData.append('event', JSON.stringify(jsonData));

      let response;
      if (isEditing) {
        response = await api.organizations.events.update(orgId!, eventId!, formData);
      } else {
        response = await api.organizations.events.create(orgId!, formData);
      }

      if (response) {
        navigate(`/organizations/${orgId}`);
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError(isEditing ? t('updateError') : t('createError'));
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !eventId) return;

    try {
      setLoading(true);
      await api.organizations.events.delete(orgId!, eventId);
      navigate(`/organizations/${orgId}`);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(t('deleteError'));
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const validateAndOpenDialog = async () => {
    // Clear location fields if remote
    if (isRemote) {
      form.setValue('province', '');
      form.setValue('country', '');
      form.setValue('latitude', '');
      form.setValue('longitude', '');
    }

    const isValid = await form.trigger();
    if (isValid) {
      setIsDialogOpen(true);
    }
  };

  if (!isAuth || !userProfile) {
    return null;
  }

  if (initialLoading) {
    return (
      <Layout>
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-orange-500 pl-4">
                {isEditing ? t('editEvent') : t('createEvent')}
              </h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Event Poster and Basic Info */}
              <div className="flex flex-wrap gap-6">
                {/* Poster Upload */}
                <div className="flex-shrink-0">
                  {posterPreview ? (
                    <div className="relative group">
                      <div
                        className="w-64 h-80 rounded-lg overflow-hidden border-2 border-gray-200 shadow-md"
                        style={{ aspectRatio: '3/4' }}
                      >
                        <img
                          src={posterPreview}
                          alt="Event poster"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            onClick={handleUploadPoster}
                            className="bg-white text-black hover:bg-gray-100"
                          >
                            {t('changePoster')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-64 h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors"
                      onClick={handleUploadPoster}
                      style={{ aspectRatio: '3/4' }}
                    >
                      <CloudUpload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 text-center mb-2">{t('uploadPoster')}</p>
                      <p className="text-sm text-gray-400 text-center">
                        Aspect ratio: 3:4<br />
                        Max 10 MB
                      </p>
                    </div>
                  )}
                  {form.formState.errors.picUrl && (
                    <p className="text-red-600 text-sm mt-2">{form.formState.errors.picUrl.message}</p>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 min-w-0 space-y-4">
                  <div>
                    <Label htmlFor="name">{t('eventName')} *</Label>
                    <Input
                      id="name"
                      {...form.register('name', {
                        required: t('required'),
                        minLength: { value: 3, message: 'Event name must be at least 3 characters' },
                        maxLength: { value: 100, message: 'Event name cannot exceed 100 characters' },
                      })}
                      placeholder="Enter event name"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">{t('startDate')} *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...form.register('startDate', { required: t('required') })}
                      />
                      {form.formState.errors.startDate && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.startDate.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="endDate">{t('endDate')} *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        {...form.register('endDate', { required: t('required') })}
                      />
                      {form.formState.errors.endDate && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.endDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">{t('startTime')} *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...form.register('startTime', { required: t('required') })}
                      />
                      {form.formState.errors.startTime && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.startTime.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="endTime">{t('endTime')} *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        {...form.register('endTime', { required: t('required') })}
                      />
                      {form.formState.errors.endTime && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.endTime.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priceType">{t('priceType')} *</Label>
                      <Controller
                        name="priceType"
                        control={form.control}
                        rules={{ required: t('required') }}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">{t('priceType')}</option>
                            <option value="free">{t('free')}</option>
                            <option value="paid">{t('paid')}</option>
                          </Select>
                        )}
                      />
                      {form.formState.errors.priceType && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.priceType.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="audience">{t('audience')} *</Label>
                      <Controller
                        name="audience"
                        control={form.control}
                        rules={{ required: t('required') }}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">{t('audience')}</option>
                            <option value="general">{t('general')}</option>
                            <option value="professional">{t('professional')}</option>
                          </Select>
                        )}
                      />
                      {form.formState.errors.audience && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.audience.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div>
                <Label htmlFor="content">{t('eventDescription')} *</Label>
                <Textarea
                  id="content"
                  rows={6}
                  {...form.register('content', {
                    required: t('required'),
                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                  })}
                  placeholder="Describe your event..."
                />
                {form.formState.errors.content && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.content.message}</p>
                )}
              </div>

              {/* Location Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-l-4 border-orange-500 pl-4">
                  {t('mapIntegration')}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="locationType">{t('eventType')} *</Label>
                    <Controller
                      name="locationType"
                      control={form.control}
                      rules={{ required: t('required') }}
                      render={({ field }) => (
                        <Select {...field}>
                          <option value="">{t('eventType')}</option>
                          <option value="online">{t('online')}</option>
                          <option value="onsite">{t('onsite')}</option>
                        </Select>
                      )}
                    />
                    {form.formState.errors.locationType && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.locationType.message}</p>
                    )}
                  </div>

                  {form.watch('locationType') && (
                    <div>
                      <Label htmlFor="locationName">
                        {isRemote ? t('channelName') : t('locationName')} *
                      </Label>
                      <Input
                        id="locationName"
                        {...form.register('locationName', { required: t('required') })}
                        placeholder={
                          isRemote
                            ? 'e.g. Discord, MS Teams, Zoom, etc.'
                            : 'Enter location name'
                        }
                      />
                      {form.formState.errors.locationName && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.locationName.message}</p>
                      )}
                    </div>
                  )}

                  {!isRemote && form.watch('locationType') && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="province">{t('province')} *</Label>
                          <Input
                            id="province"
                            {...form.register('province', { required: !isRemote ? t('required') : false })}
                            placeholder="Province"
                          />
                          {form.formState.errors.province && (
                            <p className="text-red-600 text-sm mt-1">{form.formState.errors.province.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="country">{t('country')} *</Label>
                          <Controller
                            name="country"
                            control={form.control}
                            rules={{ required: !isRemote ? t('required') : false }}
                            render={({ field }) => (
                              <Select {...field}>
                                <option value="TH">Thailand</option>
                              </Select>
                            )}
                          />
                          {form.formState.errors.country && (
                            <p className="text-red-600 text-sm mt-1">{form.formState.errors.country.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">{t('mapCoordinate')}</Label>
                        <p className="text-sm text-gray-500 mb-2">(required for map display)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="latitude">{t('latitude')}</Label>
                            <Input
                              id="latitude"
                              {...form.register('latitude')}
                              placeholder="13.7563..."
                            />
                            {form.formState.errors.latitude && (
                              <p className="text-red-600 text-sm mt-1">{form.formState.errors.latitude.message}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="longitude">{t('longitude')}</Label>
                            <Input
                              id="longitude"
                              {...form.register('longitude')}
                              placeholder="100.3456..."
                            />
                            {form.formState.errors.longitude && (
                              <p className="text-red-600 text-sm mt-1">{form.formState.errors.longitude.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Registration Link */}
              <div>
                <Label htmlFor="registerLink">{t('registerLink')} *</Label>
                <Input
                  id="registerLink"
                  type="url"
                  {...form.register('registerLink', {
                    required: t('required'),
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: t('invalidUrl'),
                    },
                  })}
                  placeholder="https://..."
                />
                {form.formState.errors.registerLink && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.registerLink.message}</p>
                )}
              </div>

              {/* Contact Channels */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 border-l-4 border-orange-500 pl-4">
                    {t('contactChannels')}
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={fields.length >= 4}
                    onClick={() => append({ media: '', mediaLink: '' })}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t('addContactChannel')}
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <Label htmlFor={`contactChannels.${index}.media`}>
                          {t('channelType')}
                        </Label>
                        <Controller
                          name={`contactChannels.${index}.media`}
                          control={form.control}
                          rules={{ required: t('required') }}
                          render={({ field: { onChange, value } }) => (
                            <Select value={value} onChange={(e) => onChange(e.target.value)}>
                              <option value="">Select channel</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Twitter">Twitter</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Instagram">Instagram</option>
                              <option value="Website">Website</option>
                            </Select>
                          )}
                        />
                        {form.formState.errors.contactChannels?.[index]?.media && (
                          <p className="text-red-600 text-sm mt-1">
                            {form.formState.errors.contactChannels[index]?.media?.message}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`contactChannels.${index}.mediaLink`}>
                          {t('channelUrl')}
                        </Label>
                        <Input
                          id={`contactChannels.${index}.mediaLink`}
                          type="url"
                          placeholder="https://"
                          {...form.register(`contactChannels.${index}.mediaLink`, {
                            required: t('required'),
                            pattern: {
                              value: /^https?:\/\/.+/,
                              message: t('invalidUrl'),
                            },
                          })}
                        />
                        {form.formState.errors.contactChannels?.[index]?.mediaLink && (
                          <p className="text-red-600 text-sm mt-1">
                            {form.formState.errors.contactChannels[index]?.mediaLink?.message}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-6"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6 border-t">
                <div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('deleteButton')}
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/organizations/${orgId}`)}
                  >
                    {t('cancelButton')}
                  </Button>
                  <Button
                    type="button"
                    onClick={validateAndOpenDialog}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      t('saveButton')
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('confirmPublication')}</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to save this event? This action will make it visible to the public.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={loading}
                  >
                    {t('cancelButton')}
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will remove this event permanently. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={loading}
                  >
                    {t('cancelButton')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Confirm'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventFormPage;
