"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import React, { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, TSignUpSchema } from "@/lib/types";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { signUp } from "@/features/auth/api/action";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const { setAuthState } = useAuth();
  const router = useRouter();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("Auth.signup");
  const generalT = useTranslations("Common.general");

  const toggleVisibility = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signupSchema),
  });

  const passwordCriteria = [
    { regex: /.{8,}/, label: t("passwordCriteria.length") },
    { regex: /[A-Z]/, label: t("passwordCriteria.uppercase") },
    { regex: /[a-z]/, label: t("passwordCriteria.lowercase") },
    { regex: /[0-9]/, label: t("passwordCriteria.number") },
    { regex: /[!@#$%^&*_]/, label: t("passwordCriteria.special") },
  ];
  const password = watch("password");
  const checkCriteria = (regex: RegExp) => regex.test(password);

  const onSubmit = async (data: FieldValues) => {
    // Show loading toast immediately when the request is sent
    const loadingToastId = toast.loading(generalT("loading"));

    try {
      const result = await signUp(data);

      // On-Recieve Response : Dismiss the loading toast once we have a response
      toast.dismiss(loadingToastId);

      if (result.status === 400) {
        Object.entries(result.errors).forEach(([key, message]) => {
          setError(key as keyof TSignUpSchema, {
            type: "server",
            message: message as string,
          });
        });
        return;
      }

      if (result.success) {
        // Await the full auth state setup
        setAuthState();
        const successToastId = toast.success(t("success"));

        // Delay the redirect to show the toast
        setTimeout(() => {
          toast.dismiss(successToastId); // Clear the success toast
          router.push("/home"); // Redirect to home
        }, 1000); // Delay of 1.5 seconds for users to see the success message
        return;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // if fail to sent request to server
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : t("error"));
      console.error("Login error:", error);
    }
  };

  return (
    <div className="font-prompt overflow-hidden h-[100vh]">
      <form
        className="relative flex flex-col items-center gap-3 sm:gap-5 w-full lg:max-w-[914px] bg-white drop-shadow-2xl h-full
        lg:rounded-t-[20px] mx-auto lg:mt-[43px] px-[50px] md:px-[84px] "
        onSubmit={handleSubmit(onSubmit)}
      >
        <Link
          className="absolute px-2 py-1 rounded-full hover:bg-slate-100 inline-flex gap-2 top-[20px] left-[20px] 
          hover:cursor-pointer"
          href={"/login"}
        >
          <ArrowLeft height={25} width={25} />
          <p className="self-center hidden sm:block">{t("backToLogin")}</p>
        </Link>
        <p className="text-3xl sm:text-4xl font-semibold text-center text-orange-dark mt-8 md:mt-[50px] lg:mt-[34px]">
          {t("title")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4 sm:gap-[26px]">
          <div className="w-full">
            <Label className="text-base font-normal" htmlFor="first-name">
              {t("firstNameLabel")}
              {errors.firstName && (
                <span className="error-msg">
                  {errors.firstName.message as string}
                </span>
              )}
            </Label>
            <Input
              {...register("firstName")}
              className="auth-input"
              type="text"
              id="first-name"
              placeholder={t("firstNamePlaceholder")}
            />
          </div>

          <div className="w-full">
            <Label className="text-base font-normal" htmlFor="last-name">
              {t("lastNameLabel")}
              {errors.lastName && (
                <span className="error-msg">
                  {errors.lastName.message as string}
                </span>
              )}
            </Label>
            <Input
              {...register("lastName")}
              className="auth-input"
              type="text"
              id="last-name"
              placeholder={t("lastNamePlaceholder")}
            />
          </div>
        </div>
        <div className="w-full">
          <Label className="text-base font-normal" htmlFor="email">
            {t("emailLabel")}
            {errors.email && (
              <span className="error-msg">
                {errors.email.message as string}
              </span>
            )}
          </Label>
          <Input
            {...register("email")}
            className="auth-input"
            type="email"
            id="email"
            placeholder={t("emailPlaceholder")}
          />
        </div>
        <div className="w-full">
          <Label className="text-base font-normal" htmlFor="phone-num">
            {t("phoneLabel")}{" "}
            {errors.phone && (
              <span className="error-msg">
                {errors.phone.message as string}
              </span>
            )}
          </Label>
          <Input
            {...register("phone")}
            className="auth-input"
            type="text"
            id="phone-num"
            placeholder={t("phonePlaceholder")}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4 sm:gap-[26px]">
          <div className="w-full">
            <Label className="text-base font-normal" htmlFor="password">
              {t("passwordLabel")}{" "}
              {errors.password && (
                <span className="error-msg">
                  {errors.password.message as string}
                </span>
              )}
            </Label>
            <div className="relative">
              <Input
                {...register("password")}
                className="auth-input "
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={t("passwordPlaceholder")}
                onFocus={() => setTooltipVisible(true)}
                onBlur={() => setTooltipVisible(false)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={toggleVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
              {tooltipVisible && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-sm text-gray-700 z-10">
                  <ul>
                    {passwordCriteria.map(({ regex, label }, index) => (
                      <li
                        key={index}
                        className={`flex items-center space-x-2 ${
                          checkCriteria(regex)
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span>{checkCriteria(regex) ? "✔️" : "❌"}</span>
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <Label className="text-base font-normal" htmlFor="confirmPassword">
              {t("confirmPasswordLabel")}{" "}
              {errors.confirmPassword && (
                <span className="error-msg">
                  {errors.confirmPassword.message as string}
                </span>
              )}
            </Label>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                className="auth-input "
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder={t("confirmPasswordPlaceholder")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={toggleVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
        <div className="flex flex-col w-full mb-[60px]">
          <div className="inline-flex gap-1 w-full justify-center sm:justify-start items-center self-start mt-2 sm:mt-0">
            <input
              type="checkbox"
              className="w-4 h-4 accent-black"
              {...register("policies")}
              id="policies"
            />
            <Label
              className="hover:cursor-pointer font-light text-sm"
              htmlFor="policies"
            >
              {t("acceptLabel")}
              <Link
                className="ml-1 hover:underline text-orange-dark hover:text-orange-normal"
                href={"/info/tos"}
              >
                {t("termsOfService")}
              </Link>
              <span> {t("and")} </span>
              <Link
                className="ml-1 hover:underline text-orange-dark hover:text-orange-normal"
                href={"/info/privacy"}
              >
                {t("privacyPolicy")}
              </Link>
            </Label>
          </div>
          {errors.policies && (
            <span className="error-msg self-center sm:self-start sm:pl-2">
              {errors.policies.message as string}
            </span>
          )}
          <div className="flex flex-col w-full gap-[20px]">
            <Button
              className="self-center sm:self-end mt-5 sm:mt-0 text-md font-normal bg-orange-dark 
              hover:bg-orange-normal hover:shadow-md h-[40px] rounded-[10px] w-full sm:w-[140px]"
              type="submit"
              disabled={isSubmitting}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
