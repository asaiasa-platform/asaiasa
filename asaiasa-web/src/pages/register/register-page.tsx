import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { signupSchema, SignupFormData } from '@/lib/validation';
import { authService } from '@/services/auth';
import { useAuth } from '@/contexts/auth-context';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Label } from '@/components/base/input/label';

export default function RegisterPage() {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations('Auth.signup');
  const commonT = useTranslations('Common');

  const toggleVisibility = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const passwordCriteria = [
    { regex: /.{8,}/, label: t('passwordCriteria.length') },
    { regex: /[A-Z]/, label: t('passwordCriteria.uppercase') },
    { regex: /[a-z]/, label: t('passwordCriteria.lowercase') },
    { regex: /[0-9]/, label: t('passwordCriteria.number') },
    { regex: /[!@#$%^&*_]/, label: t('passwordCriteria.special') },
  ];

  const password = watch('password');
  const checkCriteria = (regex: RegExp) => regex.test(password || '');

  const onSubmit = async (data: SignupFormData) => {
    const loadingToastId = toast.loading(commonT('loading'));

    try {
      // Prepare data for backend
      const signupData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        phone: data.phone,
      };

      const result = await authService.signup(signupData);

      toast.dismiss(loadingToastId);

      if (result.success) {
        // Update auth state
        await setAuthState();
        toast.success(t('success'));

        // Redirect to home page
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        // Handle server validation errors
        if (result.error?.includes('email')) {
          setError('email', {
            type: 'server',
            message: 'อีเมลนี้ถูกใช้งานแล้ว',
          });
        } else if (result.error?.includes('phone')) {
          setError('phone', {
            type: 'server',
            message: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว',
          });
        } else {
          toast.error(result.error || t('error'));
        }
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(error instanceof Error ? error.message : t('error'));
      console.error('Signup error:', error);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gray-50 font-prompt overflow-hidden">
        <div className="flex justify-center items-center min-h-screen py-8">
          <form
            className="relative flex flex-col items-center gap-3 sm:gap-5 w-full max-w-4xl bg-white shadow-2xl rounded-2xl mx-4 px-6 sm:px-12 py-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Link
              to="/login"
              className="absolute px-3 py-2 rounded-full hover:bg-gray-100 inline-flex gap-2 top-4 left-4 hover:cursor-pointer transition-colors"
            >
              <ArrowLeft height={20} width={20} />
              <span className="self-center hidden sm:block text-sm">{t('backToLogin')}</span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-semibold text-center text-orange-600 mt-8 mb-6">
              {t('title')}
            </h1>

            {/* Name Fields */}
            <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4 sm:gap-6">
              <div className="w-full">
                <Label className="text-base font-medium" htmlFor="first-name">
                  {t('firstNameLabel')}
                  {errors.firstName && (
                    <span className="text-red-500 text-sm ml-2">
                      {errors.firstName.message}
                    </span>
                  )}
                </Label>
                <Input
                  {...register('firstName')}
                  className="mt-1"
                  type="text"
                  id="first-name"
                  placeholder={t('firstNamePlaceholder')}
                />
              </div>

              <div className="w-full">
                <Label className="text-base font-medium" htmlFor="last-name">
                  {t('lastNameLabel')}
                  {errors.lastName && (
                    <span className="text-red-500 text-sm ml-2">
                      {errors.lastName.message}
                    </span>
                  )}
                </Label>
                <Input
                  {...register('lastName')}
                  className="mt-1"
                  type="text"
                  id="last-name"
                  placeholder={t('lastNamePlaceholder')}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="w-full">
              <Label className="text-base font-medium" htmlFor="email">
                {t('emailLabel')}
                {errors.email && (
                  <span className="text-red-500 text-sm ml-2">
                    {errors.email.message}
                  </span>
                )}
              </Label>
              <Input
                {...register('email')}
                className="mt-1"
                type="email"
                id="email"
                placeholder={t('emailPlaceholder')}
              />
            </div>

            {/* Phone Field */}
            <div className="w-full">
              <Label className="text-base font-medium" htmlFor="phone-num">
                {t('phoneLabel')}
                {errors.phone && (
                  <span className="text-red-500 text-sm ml-2">
                    {errors.phone.message}
                  </span>
                )}
              </Label>
              <Input
                {...register('phone')}
                className="mt-1"
                type="text"
                id="phone-num"
                placeholder={t('phonePlaceholder')}
              />
            </div>

            {/* Password Fields */}
            <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4 sm:gap-6">
              <div className="w-full">
                <Label className="text-base font-medium" htmlFor="password">
                  {t('passwordLabel')}
                  {errors.password && (
                    <span className="text-red-500 text-sm ml-2">
                      {errors.password.message}
                    </span>
                  )}
                </Label>
                <div className="relative mt-1">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder={t('passwordPlaceholder')}
                    onFocus={() => setTooltipVisible(true)}
                    onBlur={() => setTooltipVisible(false)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={toggleVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                  
                  {/* Password Criteria Tooltip */}
                  {tooltipVisible && password && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-sm text-gray-700 z-10">
                      <ul className="space-y-2">
                        {passwordCriteria.map(({ regex, label }, index) => (
                          <li
                            key={index}
                            className={`flex items-center space-x-2 ${
                              checkCriteria(regex) ? 'text-green-600' : 'text-gray-500'
                            }`}
                          >
                            <span>{checkCriteria(regex) ? '✅' : '❌'}</span>
                            <span>{label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full">
                <Label className="text-base font-medium" htmlFor="confirmPassword">
                  {t('confirmPasswordLabel')}
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm ml-2">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </Label>
                <div className="relative mt-1">
                  <Input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder={t('confirmPasswordPlaceholder')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={toggleVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex flex-col w-full mb-8">
              <div className="inline-flex gap-3 w-full justify-center sm:justify-start items-start self-start mt-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-orange-600 mt-0.5"
                  {...register('policies')}
                  id="policies"
                />
                <Label
                  className="hover:cursor-pointer font-normal text-sm text-gray-700 leading-relaxed"
                  htmlFor="policies"
                >
                  {t('acceptLabel')}
                  <Link
                    to="/terms"
                    className="ml-1 hover:underline text-orange-600 hover:text-orange-700"
                  >
                    {t('termsOfService')}
                  </Link>
                  <span> {t('and')} </span>
                  <Link
                    to="/privacy"
                    className="hover:underline text-orange-600 hover:text-orange-700"
                  >
                    {t('privacyPolicy')}
                  </Link>
                </Label>
              </div>
              {errors.policies && (
                <span className="text-red-500 text-sm self-center sm:self-start mt-2">
                  {errors.policies.message}
                </span>
              )}

              {/* Submit Button */}
              <div className="flex flex-col w-full gap-5 mt-6">
                <Button
                  className="self-center sm:self-end text-base font-medium bg-orange-600 hover:bg-orange-700 hover:shadow-md h-12 rounded-lg w-full sm:w-40 transition-all duration-200"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? commonT('loading') : t('submit')}
                </Button>

                <div className="text-center">
                  <span className="text-gray-600">{t('haveAccount')} </span>
                  <Link
                    to="/login"
                    className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                  >
                    {t('loginHere')}
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
