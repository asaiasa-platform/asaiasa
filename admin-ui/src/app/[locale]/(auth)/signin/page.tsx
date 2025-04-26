"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import LangSwitcher from "@/components/common/LangSwitcher";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginBtn from "@/features/auth/GoogleLoginBtn";
import { signIn } from "@/features/auth/api/action";
import { useSearchParams } from "next/navigation";

export default function SigninPage() {
  const t = useTranslations("SignIn");
  const c = useTranslations("Common");
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthState } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the callback URL from the query parameters
    const callback = searchParams.get("redirect");
    if (callback) {
      setCallbackUrl(callback);
      console.log(callback);
    }
  }, [searchParams]);

  const handleRedirect = () => {
    if (callbackUrl) {
      window.location.href = "/" + callbackUrl;
    } else {
      window.location.href = "/my-organizations";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const OnSubmit = async (data: FieldValues) => {
    try {
      const result = await signIn({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        // Await the full auth state setup
        setAuthState();
        toast({
          title: c("success"),
          description: t("success-message"),
        });

        handleRedirect();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: t("login-failed"),
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during login.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="font-prompt flex min-h-screen flex-col items-center justify-center px-16 -translate-y-7">
      <div className="absolute top-12 right-6">
        <LangSwitcher />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-3 max-w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="flex flex-col gap-2 text-2xl tracking-tight">
            <span className="font-medium">{t("title")}</span>
            <div className="flex flex-col gap-1">
              <Image
                src={"/logo-2.png"}
                width={1500}
                height={1000}
                alt="Logo"
              />
              <span className="text-xs font-light text-left text-gray-500 italic mb-4">
                {t("cms-console")}
              </span>
            </div>
          </h1>

          <p className="text-sm text-muted-foreground">
            {t("enter-email")}
          </p>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(OnSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <div>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    {...register("email", {
                      required: t("email-required"),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t("invalid-email"),
                      },
                    })}
                    id="email"
                    placeholder={t("email-placeholder")}
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                  {errors.email && (
                    <p className="error-msg">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Input
                      {...register("password", {
                        required: t("password-required"),
                      })}
                      id="password"
                      placeholder={t("password-placeholder")}
                      type={showPassword ? "text" : "password"}
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? t("hide-password") : t("show-password")
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>

                  {errors.password && (
                    <p className="error-msg">{errors.password.message}</p>
                  )}
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {t("sign-in-button")}
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("or-continue-with")}
              </span>
            </div>
          </div>
          <GoogleLoginBtn handleRedirect={handleRedirect} />
        </div>
      </div>
    </div>
  );
}
