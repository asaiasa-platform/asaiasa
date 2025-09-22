"use client";

import { usePathname } from "next/navigation";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import { ReactNode } from "react";

interface ClientPageWrapperProps {
  children: ReactNode;
}

export default function ClientPageWrapper({ 
  children
}: ClientPageWrapperProps) {
  const pathname = usePathname();
  useRouteProtection(pathname);

  return (
    <>
      {children}
    </>
  );
}
