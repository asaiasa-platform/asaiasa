import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { googleOauthCallback } from "./api/action";

export default function GoogleLoginBtn() {
  const { setAuthState } = useAuth();
  const router = useRouter();
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      const result = await googleOauthCallback(tokenResponse.code);
      if (result.success) {
        setAuthState();
        const toastId = toast.success("เข้าสู่ระบบสําเร็จ");
        setTimeout(() => {
          toast.dismiss(toastId); // Clear the success toast
          router.push("/home"); // Redirect to home
        }, 1000);
      } else {
        console.log("Golang Callback Failed");
      }
    },
    onError: (error) => {
      console.log("Login Flow Failed");
      console.log(error);
    },
  });
  return (
    <button
      onClick={() => login()}
      className="inline-flex gap-2 border hover:border-black/30 hover:shadow-md rounded-[10px]
                    h-[48px] w-full text-sm font-normal justify-center items-center"
    >
      <Image
        src={"/icon/google-icon.svg"}
        width={33}
        height={33}
        alt="google-login"
      />
      เข้าสู่ระบบด้วย Google
    </button>
  );
}
