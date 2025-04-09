"use client";

import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  }, [router]);
  return <></>;
}
