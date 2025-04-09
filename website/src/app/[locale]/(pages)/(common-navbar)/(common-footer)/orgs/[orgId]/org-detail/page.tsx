import Badge from "@/components/common/Badge";
import StaticMap from "@/components/ui/StaticMap";
import React, { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import { OrganizationDescription } from "@/lib/types";
import { getOrgsDescription } from "@/features/orgs/api/action";
import NotFoundSVG from "@/components/page/NotFound";
import SocialContactButton from "@/components/common/SocialContactBtn";

export default async function OrgDescriptionPage({
  params,
}: Readonly<{
  params: { orgId: string }; // Accept event ID from URL params
}>) {
  const { orgId } = params;
  const data: OrganizationDescription = await getOrgsDescription(orgId);

  if (!data) {
    return NotFoundSVG();
  }

  const {
    industries,
    specialty,
    description,
    address,
    email,
    phone,
    organizationContacts,
    latitude,
    longitude,
  } = data;

  return (
    <Suspense fallback={<Spinner />}>
      <div className="flex flex-col gap-[60px]">
        <div className="flex flex-col gap-2">
          <p className="text-lg sm:text-xl font-semibold">ข้อมูลทั่วไป</p>
          <div className="flex gap-6 mt-2 leading-loose">
            <p className="text-left shrink-0 text-sm sm:text-base">
              ประเภทธุรกิจ :
            </p>
            <div className="flex flex-wrap justify-start items-center gap-2">
              {industries.map((industry) => (
                <Badge key={industry.id} label={industry.name} />
              ))}
            </div>
          </div>
          {specialty && (
            <div className="flex gap-6 mt-1">
              <p className="text-left shrink-0 text-sm sm:text-base">
                ความชำนาญ :
              </p>
              <p className="text-left text-sm sm:text-base font-normal">
                {specialty}
              </p>
            </div>
          )}
          <pre className="mt-4 font-prompt text-base font-normal whitespace-pre-wrap break-words">
            {description}
          </pre>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 w-full">
            <div className="flex flex-col gap-[60px]">
              <div className="flex flex-col gap-3">
                <p className="text-lg sm:text-xl font-semibold">
                  ข้อมูลการติดต่อ
                </p>
                <div className="grid grid-cols-4">
                  <p className="text-left shrink-0 text-sm sm:text-base">
                    ที่ตั้ง :
                  </p>
                  <p className="text-sm sm:text-base font-normal col-span-3">
                    {address}
                  </p>
                </div>
                <div className="grid grid-cols-4">
                  <p className="text-left shrink-0 text-sm sm:text-base">
                    อีเมล :
                  </p>
                  <p className="text-sm sm:text-base font-normal col-span-3">
                    {email}
                  </p>
                </div>
                <div className="grid grid-cols-4">
                  <p className="text-left shrink-0 text-sm sm:text-base">
                    เบอร์โทรศัพท์ :
                  </p>
                  <p className="text-sm sm:text-base font-normal col-span-3">
                    {phone}
                  </p>
                </div>
              </div>
              {organizationContacts && organizationContacts.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-lg sm:text-xl font-semibold">
                    ช่องทางอื่นๆ
                  </p>
                  <div className="flex flex-row gap-2 flex-wrap">
                    {organizationContacts.map((item, index) => {
                      return (
                        <SocialContactButton
                          key={index}
                          mediaType={item.media}
                          mediaLink={item.mediaLink}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {latitude !== null &&
              longitude !== null &&
              latitude !== 0 &&
              longitude !== 0 && (
                <div className="rounded-[10px] col-span-2 h-[300px] lg:h-[365px] bg-slate-200 w-full max-w-[520px] overflow-hidden drop">
                  <StaticMap lat={latitude} lng={longitude} />
                </div>
              )}
          </div>
        </div>
        {/* <div className="flex flex-col gap-3">
          <p className="text-lg sm:text-xl font-semibold">แกลลอรี่องค์กร</p>
          <GalleryCarousel gallery={gallery} />
        </div> */}
      </div>
    </Suspense>
  );
}
