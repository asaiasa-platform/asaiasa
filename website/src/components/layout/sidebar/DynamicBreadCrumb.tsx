"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  // const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on the server-side and first render on the client
  }

  // Remove the base path ('/th' & '/en')
  const pathWithoutLocale = pathname.replace(/^\/(th|en)/, "");

  // Split the path into segments
  const pathSegments = pathWithoutLocale.split("/").filter(Boolean);

  // Create a structure that preserves the full path
  const breadcrumbItems = [];
  let currentPath = `/${locale}`;

  // Process each segment to build breadcrumb items
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];

    // Skip the numeric ID at the beginning if it exists
    if (i === 0 && !isNaN(Number(segment))) {
      currentPath += `/${segment}`;
      continue;
    }

    // Add the segment to the current path
    currentPath += `/${segment}`;

    // For "edit" followed by an ID, we want to keep them together
    if (
      segment === "edit" &&
      i + 1 < pathSegments.length &&
      !isNaN(Number(pathSegments[i + 1]))
    ) {
      // const editWithId = `${segment} ${pathSegments[i + 1]}`
      breadcrumbItems.push({
        text: formatText(segment),
        href: currentPath + `/${pathSegments[i + 1]}`,
        isLast: i + 1 === pathSegments.length - 1,
      });
      i++; // Skip the next segment (the ID)
    } else {
      breadcrumbItems.push({
        text: formatText(segment),
        href: currentPath,
        isLast: i === pathSegments.length - 1,
      });
    }
  }

  // Function to format breadcrumb item text
  function formatText(text: string) {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (breadcrumbItems.length === 0) {
    return null; // Don't render anything if there are no paths
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            {item.isLast ? (
              <BreadcrumbPage>{item.text}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={item.href}>{item.text}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
