import * as React from "react";
import { OrganizationCard } from "@/features/orgs/components/OrgCard";
import { Search } from "lucide-react";
import { getAllOrgs } from "@/features/orgs/api/action";
import { OrganizationBrief } from "@/lib/types";
import { getTranslations } from "next-intl/server";
export default async function OrgListingPage({
  params,
}: Readonly<{ params: { locale: string } }>) {
  const t = await getTranslations("Organizations");
  const orgs: OrganizationBrief[] = await getAllOrgs(1);
  return (
    <div className="flex flex-col min-h-screen">
      {/* <div className="font-prompt max-w-[1170px] mx-auto px-6 flex-grow mb-16"> */}
      <div className="font-prompt mx-auto px-6 flex-grow mb-16">
        <div className="text-center font-semibold text-2xl border-b-2 pb-[11px] mt-[100px]">
          <span className="text-black">{t("search.prefix")}</span>
          <span className="text-orange-normal"> &quot;{t("search.highlight")}&quot; </span>
          <span className="text-black">{t("search.suffix")}</span>
        </div>

        {/* <div className="border-[1.5px] mt-[26px] border-gray-stroke/70" /> */}
        <div className="flex justify-between items-center gap-5 w-full mt-[25px] ">
          <div className="flex-grow bg-white relative max-w-[455px] border border-gray-300 rounded-full">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="flex-grow h-[48px] w-full px-4 py-2 placeholder:text-gray-inactive placeholder:font-light text-gray-700 bg-transparent outline-none"
            />
            <div className="bg-white absolute top-0 rounded-r-full pr-1 right-0 h-[48px] w-[55px] flex items-center justify-end">
              <button className="bg-orange-normal hover:bg-orange-normal/80 transition-all duration-200 flex justify-center items-center h-[40px] w-[40px] rounded-full">
                <Search className="h-[18px] w-[18px] text-white" />
              </button>
            </div>
          </div>
          {/* <button className="flex justify-center items-center border bg-white hover:drop-shadow-md border-gray-stroke rounded-[10px] h-[48px] min-w-[48px] px-3 max-w-[104px] text-gray-btngray">
            <SlidersHorizontal className="h-[18px] w-[18px]" />

            <span className="hidden sm:block text-sm font-medium ml-2">
              ตัวกรอง
            </span>
          </button> */}
        </div>

        <div className="flex flex-col mt-8">
          {orgs && orgs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {orgs.map((org) => (
                <OrganizationCard
                  id={org.id}
                  key={org.id}
                  name={org.name}
                  picUrl={org.picUrl || "/logo.svg"}
                  province={org.province}
                  country={org.country}
                  industries={org.industries}
                  headline={org.headline}
                  locale={params.locale}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-[100px] mb-[150px] text-center">
              <p className="text-2xl font-medium text-gray-600 mb-2">
                {t("notFound")}
              </p>
            </div>
          )}
        </div>
        {/* <div className="flex justify-center mt-3">
          <Pagination count={36} variant="outlined" shape="rounded" />
        </div> */}
      </div>
    </div>
  );
}
