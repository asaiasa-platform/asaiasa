import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DropDownMenu from "./DropDownMenu";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MobileAvatar() {
  const { isAuth, userProfile, loading } = useAuth();

  // Don't render anything until auth state is confirmed
  if (loading) {
    return (
      <div className="h-[40px] w-[40px] animate-pulse bg-gray-200 rounded-full" />
    );
  }

  return (
    <>
      {!isAuth ? (
        <div className="flex flex-col gap-2 mt-5">
          <Link href="/login">
            <div
              className="
                    flex h-[42px] justify-center items-center font-normal hover:bg-slate-50 text-black
                    rounded-full border transition-all duration-200 text-sm"
            >
              เข้าสู่ระบบ / สมัครสมาชิก
            </div>
          </Link>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full">
          <AccordionItem className="px-3 border-none" value={`item-${1}`}>
            <AccordionTrigger className="hover:no-underline py-[10px]">
              <div className="flex justify-center items-center w-full gap-2">
                <div
                  style={{ aspectRatio: "1 / 1" }}
                  className="shrink-0 h-[40px] w-[40px] rounded-full overflow-hidden"
                >
                  <Avatar className="h-full w-full rounded-full">
                    <AvatarImage
                      src={userProfile?.picUrl}
                      alt={userProfile?.firstName}
                    />
                    <AvatarFallback>
                      {userProfile?.firstName[0] +
                        "" +
                        userProfile?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="w-full text-left">
                  <p>{userProfile?.firstName + " " + userProfile?.lastName}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 w-full bg-white">
                <DropDownMenu />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}
