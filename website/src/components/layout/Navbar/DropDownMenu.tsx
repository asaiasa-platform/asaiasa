import React from "react";
import { ChartBar, Lightbulb, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/routing";

export default function DropDownMenu() {
  const { removeAuthState } = useAuth();
  return (
    <>
      {/* <div className="flex gap-1 ">
        <div className="flex flex-col gap-[5px] w-full">
          <div className="flex justify-start items-center gap-1 pl-[20px]">
            <Ticket className="h-[18px] text-gray-inactive " />
            <span className="text-xs font-light text-gray-inactive">
              อีเว้นท์
            </span>
          </div>
          <div className="flex flex-col w-full">
            <Link href={"/myreg-order"} className={btnStyleVariant1}>
              คำสั่งซื้อ
            </Link>
            <Link href={"/myreg-ticket"} className={btnStyleVariant1}>
              ตั๋วของฉัน
            </Link>
            <Link href={"/myreg-project"} className={btnStyleVariant1}>
              โครงการที่เข้าร่วม
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b"></div> */}
      {/* <div className="flex gap-1 ">
        <div className="flex flex-col gap-[5px] w-full">
          <div className="flex justify-start items-center gap-1 pl-[20px]">
            <Building2 className="h-[18px] text-gray-inactive " />
            <span className="text-xs font-light text-gray-inactive">
              องค์กร
            </span>
          </div>
          <div className="flex flex-col w-full">
            <Link href={"/myreg-org"} className={btnStyleVariant1}>
              องค์กรของฉัน
            </Link>
            <Link href={"/myreg-org-status"} className={btnStyleVariant1}>
              สถานะเข้าร่วมองค์กร
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b"></div> */}
      <div className="flex flex-col gap-1">
        <Link href={"/user-statistics"} className={btnStyleVariant2}>
          <>
            <ChartBar className="h-[18px]" />
            <span className="text-sm font-normal">สถิติกิจกรรม</span>
          </>
        </Link>
        <Link href={"/choose-preferences"} className={btnStyleVariant2}>
          <>
            <Lightbulb className="h-[18px]" />
            <span className="text-sm font-normal">ความสนใจ</span>
          </>
        </Link>
        <button onClick={removeAuthState} className={btnStyleVariant2}>
          <LogOut className="h-[18px]" />
          <span className="text-sm font-normal">ออกจากระบบ</span>
        </button>
      </div>
    </>
  );
}

// const btnStyleVariant1 =
//   "text-base font-normal py-[10px] md:py-2 hover:bg-gray-100 transition-all duration-150 pl-[47px]";
const btnStyleVariant2 =
  "flex gap-1 justify-start items-center py-[12px] md:py-2 hover:bg-gray-100 transition-all duration-150 pl-[20px]";
