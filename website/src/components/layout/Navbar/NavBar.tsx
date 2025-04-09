"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import NormalMenu from "./NormalMenu";
import CompactNormalMenu from "./CompactNormalMenu";
import MobileAvatar from "./MobileAvatar";
import LangSwitcher from "@/components/common/LangSwitcher";
import PCAvatar from "./PCAvatar";

export default function NavigationBar() {
  const menuItems = [
    {
      label: "อีเว้นท์",
      href: "/events/page/1?category=all",
    },
    {
      label: "สมัครงาน",
      href: "/jobs/page/1",
    },
    { label: "องค์กร", href: "/orgs" },
    { label: "แผนที่", href: "/map" },
  ];
  const [isMiniMenuOpen, setIsMiniMenuOpen] = useState(false);
  const handleCloseMenu = () => {
    setIsMiniMenuOpen(!isMiniMenuOpen);
  };

  return (
    <nav className="fixed bg-white shadow-md font-prompt top-0 z-50 w-full">
      <div className="max-w-[1170px] mx-auto px-6">
        <div className="flex justify-between items-center h-[65px]">
          <div className="flex gap-[30px] lg:gap-[42px] ">
            {/* Logo */}
            <div className="flex-shrink-0 flex justify-center items-center">
              <Link href="/home">
                <Image src="/logo.svg" alt="Logo" width={102} height={42} />
              </Link>
            </div>

            {/* Menu */}
            <div className="hidden md:flex space-x-[25px] lg:space-x-[38px] items-center">
              {menuItems.map((item, k) => (
                <div key={k} className="h-full flex items-center">
                  <NormalMenu label={item.label} href={item.href ?? ""} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <LangSwitcher />
            </div>
            {/* Login/Signup Button */}
            <div className="hidden md:flex md:items-center space-x-4 ">
              <PCAvatar />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMiniMenuOpen(!isMiniMenuOpen)}
                className="text-black focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMiniMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}

      <div className="md:hidden">
        <div
          className={`px-2 pt-2 pb-1 mt-[-5px] w-full bg-white absolute shadow-md overflow-hidden 
            transition-all duration-200 ease-in-out ${
              isMiniMenuOpen ? "max-h-[1000px] visible" : "max-h-0 invisible"
            }`}
        >
          <div className="space-y-1">
            {menuItems.map((item, k) => (
              <div key={k}>
                <CompactNormalMenu
                  label={item.label}
                  href={item.href}
                  handleOnClick={() => handleCloseMenu()}
                />
              </div>
            ))}
          </div>

          <div>
            <MobileAvatar />
          </div>
        </div>
      </div>
    </nav>
  );
}
