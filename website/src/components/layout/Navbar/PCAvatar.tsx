import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DropDownMenu from "./DropDownMenu";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PCAvatar() {
  const { isAuth, userProfile, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Move the click handler setup to a separate effect that depends on isAuth
  useEffect(() => {
    // Only set up click handler if authenticated and dropdown exists
    if (!loading && isAuth) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          event.target instanceof Node &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isAuth, loading]); // Add isAuth and loading to dependencies

  // Reset dropdown state when auth state changes
  useEffect(() => {
    setIsOpen(false);
  }, [isAuth]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-[40px] w-[40px] animate-pulse bg-gray-200 rounded-full" />
    );
  }

  return (
    <>
      {!isAuth ? (
        <Link href="/login">
          <div className="flex h-[42px] justify-center items-center text-gray-800 hover:text-gray-600 font-normal">
            เข้าสู่ระบบ / สมัครสมาชิก
          </div>
        </Link>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`shrink-0 h-[40px] w-[40px] rounded-full overflow-hidden ease-in-out duration-100 ${
              isOpen ? "ring-2 ring-orange-normal ring-offset-1" : ""
            }`}
          >
            <Avatar className="h-full w-full rounded-full">
              <AvatarImage
                src={userProfile?.picUrl}
                alt={userProfile?.firstName}
              />
              <AvatarFallback>
                {userProfile?.firstName[0] + "" + userProfile?.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </button>

          <div
            className={`absolute mt-[10px] flex flex-col gap-2 border w-[208px] transition-all
              right-0 top-[40px] bg-white rounded-lg py-4 shadow-lg ease-in-out duration-100
              ${
                isOpen
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 pointer-events-none -translate-y-2 scale-95"
              }`}
          >
            <DropDownMenu />
          </div>
        </div>
      )}
    </>
  );
}
