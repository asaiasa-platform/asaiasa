import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import Layout from '@/components/layout/layout';
import { Button } from '@/components/base/buttons/button';
import { GoogleLoginButton } from '@/components/auth/google-login-button';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { authService } from '@/services/auth';
import { useAuth } from '@/contexts/auth-context';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  
  const t = useTranslations('Auth.login');
  const commonT = useTranslations('Common.navigation');
  const generalT = useTranslations('Common.general');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormData) => {
    const loadingToastId = toast.loading(generalT('loading'));

    try {
      const result = await authService.login({
        email: data.email,
        password: data.password,
      });
      
      toast.dismiss(loadingToastId);

      if (result.success) {
        // Update auth state
        await setAuthState();
        const successToastId = toast.success(t('success'));
        setIsRedirecting(true);

        // Redirect after showing success message
        setTimeout(() => {
          toast.dismiss(successToastId);
          setIsRedirecting(false);
          navigate('/home');
        }, 1000);
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.dismiss();
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
      toast.error(errorMessage);
      console.error('Login error:', error);
    }
  };

  return (
    <Layout showNavbar={false}>
      <div className="font-sans flex h-screen">
        {/* Left Side - Logo (Desktop Only) */}
        <div className="hidden px-[4%] lg:flex lg:flex-col lg:w-[58%] bg-gradient-to-br from-orange-50 to-orange-100">
          <Link to="/home" className="absolute pt-[71px] z-10">
            <div className="rounded-full hover:bg-white/20 hover:shadow-lg inline-flex gap-2 text-base font-medium text-start px-5 py-1 transition-all duration-200">
              <Home height={25} width={25} />
              <p className="self-center">{commonT('home')}</p>
            </div>
          </Link>
          <div className="my-auto flex px-[5%] justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <img src="/logo-2.png" alt="ASAiASA Logo" className="h-32 w-auto" />
              </div>
              <p className="text-xl text-gray-700">Connect. Volunteer. Impact.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="xl:pt-6 w-full lg:w-[42%] sm:px-0">
          <div className="relative drop-shadow-2xl border bg-white xl:rounded-t-[20px] w-full lg:max-w-[538px] h-full mx-auto lg:ml-0">
            <div className="mx-auto mt-[50px] w-[78%] flex flex-col">
              {/* Mobile Home Link */}
              <Link
                className="absolute px-2 py-1 rounded-full hover:bg-gray-100 inline-flex gap-2 top-[30px] left-[30px] lg:hidden hover:cursor-pointer"
                to="/home"
              >
                <Home height={25} width={25} />
                <p className="self-center hidden sm:block">{commonT('home')}</p>
              </Link>

              {/* Login Title */}
              <h2 className="text-4xl font-semibold text-center text-orange-600 mb-8">
                {t('title')}
              </h2>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Email Field */}
                <div>
                  <label className="text-base font-normal block mb-2" htmlFor="email">
                    {t('emailPlaceholder')}
                    {errors.email && (
                      <span className="text-red-500 text-sm ml-2">
                        {errors.email.message}
                      </span>
                    )}
                  </label>
                  <input
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    type="email"
                    id="email"
                    placeholder={t('emailPlaceholder')}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-base font-normal block mb-2" htmlFor="password">
                    {t('passwordPlaceholder')}
                    {errors.password && (
                      <span className="text-red-500 text-sm ml-2">
                        {errors.password.message}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all pr-12"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder={t('passwordPlaceholder')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm sm:text-base font-normal text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  className="w-full text-lg font-medium bg-orange-600 hover:bg-orange-700 hover:shadow-md h-[48px] rounded-lg"
                  type="submit"
                  disabled={isSubmitting || isRedirecting}
                >
                  {isSubmitting || isRedirecting ? generalT('loading') : t('title')}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="flex gap-1 justify-center mt-6">
                <p className="font-light text-gray-600">{t('noAccount')}</p>
                <Link to="/register" className="text-orange-600 hover:text-orange-700 hover:underline font-medium">
                  {t('signupHere')}
                </Link>
              </div>

              {/* Divider */}
              <div className="h-[21px] flex justify-center items-center my-[26px]">
                <div className="w-full border-t border-gray-300" />
                <p className="mx-4 text-sm text-gray-500">{generalT('or')}</p>
                <div className="w-full border-t border-gray-300" />
              </div>

              {/* Google Login Button */}
              <GoogleLoginButton disabled={isSubmitting || isRedirecting} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;