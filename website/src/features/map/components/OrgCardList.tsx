import React from "react";
import OrgMapCard from "./OrgMapCard";
import { OrganizationMap } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OrgCardListProps {
  organizations: OrganizationMap[];
  selectedOrg: OrganizationMap | null;
  handleCardClick: (org: OrganizationMap) => void;
}

export default function OrgCardList({
  organizations,
  selectedOrg,
  handleCardClick,
}: Readonly<OrgCardListProps>) {
  return (
    <>
      <p
        className={cn(
          "text-gray-inactive text-sm font-base",
          "transition-all duration-150 delay-150 mb-1"
        )}
      >{`รายการทั้งหมด (${organizations.length})`}</p>
      <div className="flex flex-col gap-1 h-full">
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <OrgMapCard
              key={org.id}
              organization={org}
              isSelected={selectedOrg?.id === org.id}
              onCardClick={handleCardClick}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-[100px] mb-[150px]">
            <p className="text-2xl font-medium text-gray-600 mb-2">
              ไม่พบองค์กร
            </p>
            {/* <p className="text-gray-500">
            กรุณาลองค้นหาด้วยคำค้นอื่น หรือลองเปลี่ยนตัวกรอง
          </p> */}
          </div>
        )}
      </div>
    </>
  );
}
