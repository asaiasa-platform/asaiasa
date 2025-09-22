import { useGoogleLogin } from "@react-oauth/google";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export default function GoogleLoginBtn() {
  const t = useTranslations("Auth");
  
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: `${window.location.origin}/auth/google/callback`,
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
      {t("login.googleButton")}
    </button>
  );
}
