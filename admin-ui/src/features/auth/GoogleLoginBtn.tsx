import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import React from "react";
import { googleOauthCallback } from "./api/action";

export default function GoogleLoginBtn({
  handleRedirect,
}: Readonly<{ handleRedirect: () => void }>) {
  const { setAuthState } = useAuth();
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      const result = await googleOauthCallback(tokenResponse.code);
      if (result.success) {
        setAuthState();
        toast({
          title: "Success",
          description: "Signin using oauth successful",
        });

        handleRedirect();
      } else {
        console.log("Golang Callback Failed");
        toast({
          title: "Error",
          variant: "destructive",
          description: "Sign in failed",
        });
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
      className="flex items-center justify-center gap-2 border rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground"
    >
      <Image
        src={"/icon/google-icon.svg"}
        width={20}
        height={20}
        alt="google-login"
      />
      <span>Sign in with Google</span>
    </button>
  );
}
