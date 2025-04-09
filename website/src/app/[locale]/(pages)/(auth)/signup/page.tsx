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

export default function SignUpPage() {
  const { setAuthState } = useAuth();
  const router = useRouter();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    { regex: /.{8,}/, label: "ตวามยาวอย่างน้อย 8 ตัวอักษร" },
    { regex: /[A-Z]/, label: "ต้องมีตัวอักษรพิมพ์ใหญ่" },
    { regex: /[a-z]/, label: "ต้องมีตัวอักษรพิมพ์เล็ก" },
    { regex: /[0-9]/, label: "ต้องมีตัวเลขอย่างน้อยหนึ่งตัว" },
    { regex: /[!@#$%^&*_]/, label: "ต้องมีอักขระพิเศษ (!@#$%^&*_)" },
  ];
  const password = watch("password");
  const checkCriteria = (regex: RegExp) => regex.test(password);

  const onSubmit = async (data: FieldValues) => {
    // Show loading toast immediately when the request is sent
    const loadingToastId = toast.loading("รอสักครู่...");

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
        const successToastId = toast.success("ลงทะเบียนสําเร็จ");

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
      toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาด");
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
          <p className="self-center hidden sm:block">หน้าเข้าสู่ระบบ</p>
        </Link>
        <p className="text-3xl sm:text-4xl font-semibold text-center text-orange-dark mt-8 md:mt-[50px] lg:mt-[34px]">
          สมัครสมาชิก
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4 sm:gap-[26px]">
          <div className="w-full">
            <Label className="text-base font-normal" htmlFor="first-name">
              ชื่อจริง
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
              placeholder="ชื่อจริง"
            />
          </div>

          <div className="w-full">
            <Label className="text-base font-normal" htmlFor="last-name">
              นามสกุล
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
              placeholder="นามสกุล"
            />
          </div>
        </div>
        <div className="w-full">
          <Label className="text-base font-normal" htmlFor="email">
            อีเมล
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
            placeholder="example@gmail.com"
          />
        </div>
        <div className="w-full">
          <Label className="text-base font-normal" htmlFor="phone-num">
            เบอร์โทรศัพท์{" "}
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
            placeholder="0812345678"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4 sm:gap-[26px]">
          <div className="w-full">
            <Label className="text-base font-normal" htmlFor="password">
              รหัสผ่าน{" "}
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
                placeholder="รหัสผ่าน"
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
              ยืนยันรหัสผ่าน{" "}
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
                placeholder="ยืนยันรหัสผ่าน"
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
              คุณยอมรับ
              <Link
                className="ml-1 hover:underline text-orange-dark hover:text-orange-normal"
                href={"/info/tos"}
              >
                ข้อกำหนดการใช้งาน
              </Link>
              <span> และ </span>
              <Link
                className="ml-1 hover:underline text-orange-dark hover:text-orange-normal"
                href={"/info/privacy"}
              >
                นโยบายความเป็นส่วนตัว
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
              ยืนยัน
            </Button>
            {/* <div className="flex self-center sm:self-end ">
              <p className="text-base font-light">
                คุณเป็นสมาชิกอยู่แล้วหรือไม่?
              </p>

              <Link
                className="ml-1 hover:underline font-normal text-orange-dark hover:text-orange-normal"
                href={"/login"}
              >
                เข้าสู่ระบบ
              </Link>
            </div> */}
          </div>
        </div>
      </form>
    </div>
  );
}
