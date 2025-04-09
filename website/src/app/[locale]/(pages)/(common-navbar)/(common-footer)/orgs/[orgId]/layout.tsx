import { getOrgsDescription } from "@/features/orgs/api/action";
import OrgTab from "@/features/orgs/components/OrgTab";
import Image from "next/image";
import { notFound } from "next/navigation";

interface OrgPageLayoutProps {
  params: { orgId: string };
  children: React.ReactNode;
}

type OrgTabsProps = {
  name: string;
  picUrl: string;
  bgUrl: string;
  headline: string;
};

export default async function OrgPageLayout({
  children,
  params,
}: Readonly<OrgPageLayoutProps>) {
  const { orgId } = params;
  const data: OrgTabsProps = await getOrgsDescription(orgId);

  if (!data) {
    notFound();
  }

  const { name, picUrl, headline, bgUrl } = data;

  return (
    <div className="max-w-[1170px] mx-auto px-6 mt-[90px] sm:mt-[77px] pb-16">
      <div className="relative">
        <div className="hidden sm:block w-full h-[150px] sm:h-[200px] rounded-[20px] overflow-hidden">
          {bgUrl && (
            <Image
              className="w-full h-full object-cover"
              src={bgUrl}
              height={800}
              width={1000}
              alt={"organization-background-image"}
            />
          )}
        </div>
        <div className="relative sm:absolute -bottom-[90%] sm:-bottom-[50%] left-0 ">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 justify-center items-center">
            <div
              style={{ aspectRatio: "1 / 1" }}
              className="shrink-0 h-[100px] w-[100px] sm:h-[150px] sm:w-[150px] rounded-[20px] overflow-hidden drop-shadow-md"
            >
              <Image
                className="w-full h-full object-cover"
                src={picUrl || "https://via.placeholder.com/150"}
                height={500}
                width={500}
                alt={"organization-background-image"}
              />
            </div>
            <div className="flex flex-col sm:mt-11 text-center sm:text-left">
              <p className="text-lg sm:text-2xl font-medium line-clamp-1">
                {name}
              </p>
              <p className="text-sm sm:text-base font-light line-clamp-2">
                {headline}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[10px] sm:mt-[120px] w-full">
        <OrgTab />
      </div>
      <div className="flex flex-col gap-[60px] mt-8 min-h-[10vh]">
        {children}
      </div>
    </div>
  );
}
