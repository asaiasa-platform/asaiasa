"use client";

import { Button } from "@/components/ui/button";
import { getMyOrgs } from "@/features/organization/api/action";
import OrganizationCard from "@/features/organization/components/organization-card";
import { Link } from "@/i18n/routing";
import { OrganizationCardProps } from "@/lib/types";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function MyOrganizations() {
  const [orgs, setOrgs] = useState<OrganizationCardProps[]>([]);
  const [isFetchingOrgs, setIsFetchingOrgs] = useState(false);

  useEffect(() => {
    const fetchUserOrgs = async () => {
      setIsFetchingOrgs(true);
      try {
        const data = await getMyOrgs();
        console.log(data);
        if (Array.isArray(data)) {
          setOrgs(data.filter((org) => org !== null && org !== undefined));
        } else {
          setOrgs([]); // Default to an empty array if response is not an array
        }
        // setOrgs(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setIsFetchingOrgs(false);
      }
    };
    fetchUserOrgs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          {`My Organizations (${orgs.length})`}
        </h1>
        <Link href={"/org-register"}>
          <Button className="mb-8">
            <Plus size={24} />
            <span className="hidden sm:inline">Create Organization</span>
          </Button>
        </Link>
      </div>

      {isFetchingOrgs ? (
        <div className="flex items-center justify-center mt-5">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-6">
            {orgs && orgs.length > 0 ? (
              orgs
                .filter((org) => org && org.id)
                .map((org) => <OrganizationCard key={org.id} {...org} />)
            ) : (
              <div className="flex items-center justify-center mt-5">
                <span className="text-center">No organizations found</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
