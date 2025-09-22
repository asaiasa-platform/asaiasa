"use client";

import { usePathname } from "next/navigation";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import { ReactNode } from "react";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ 
  children
}: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  useRouteProtection(pathname);

  return (
    <>
      {children}
    </>
  );
}
