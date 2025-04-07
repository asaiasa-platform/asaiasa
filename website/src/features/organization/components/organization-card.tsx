import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, Briefcase, ChevronRight } from "lucide-react";
import type React from "react";
import type { OrganizationCardProps } from "@/lib/types";

export default function OrganizationCard({
  id,
  name,
  description,
  numberOfEvents,
  numberOfMembers,
  numberOfOpenJobs,
  picUrl,
}: Readonly<OrganizationCardProps>) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="flex flex-col md:flex-row justify-between md:items-center md:justify-between p-6 gap-4">
        <div className="flex items-start sm:items-center space-x-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={picUrl} alt={name} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow space-y-1">
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            <div className="flex flex-wrap items-center gap-x-6 pt-2">
              <InfoItem
                icon={<Users size={18} />}
                value={numberOfMembers}
                label="Members"
              />
              <InfoItem
                icon={<Calendar size={18} />}
                value={numberOfEvents}
                label="Events"
              />
              <InfoItem
                icon={<Briefcase size={18} />}
                value={numberOfOpenJobs}
                label="Open Jobs"
              />
            </div>
          </div>
        </div>
        <Link href={`/${id}/dashboard`} passHref className="w-full md:w-fit">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center w-full md:w-fit"
          >
            View
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon,
  value,
  label,
}: Readonly<{
  icon: React.ReactNode;
  value: number;
  label: string;
}>) {
  return (
    <div className="flex items-center space-x-2 shrink-0">
      <div className="text-gray-500">{icon}</div>
      <div>
        <span className="text-sm font-medium">{value}</span>
        <span className="text-xs text-gray-500 ml-1">{label}</span>
      </div>
    </div>
  );
}
