import Image from "next/image";
import { Link } from "@/i18n/routing";
import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function BigFooter() {
  const t = useTranslations("Footer");
  
  return (
    <div className="bg-[#375940] py-2 font-prompt ">
      <div className="flex flex-wrap gap-10 lg:justify-between max-w-[1170px] mx-auto px-6">
        <div className="flex flex-col gap-[8px]">
          {/* Logo */}
          <div className="flex max-h-[80px] justify-start items-center">
            <Link href="/home">
              <Image
                className="max-h-[80px] w-auto object-cover"
                src="/logo-white.png"
                alt="Logo"
                width={400}
                height={300}
              />
            </Link>
          </div>
          {/* <div className="text-white font-normal text-base max-w-[393px]">
            {t("address")}
          </div> */}
        </div>
        <div className="text-white font-normal text-base flex flex-col gap-6 items-end">
          <div className="w-full">
            <div className="text-orange-normal font-medium text-xl mt-2">
              {t("contactChannels")}
            </div>
            <div className="flex gap-4 justify-start items-center h-7 mt-2">
              <div className="h-full w-auto">
                <Link href="https://www.facebook.com/groups/1640369840248831" target="_blank">
                  <FaFacebook
                    className="h-full w-auto hover:text-gray-300 "
                    width={50}
                    height={50}
                  />
                </Link>
              </div>
              <div className="h-full w-auto">
                <Link href="https://www.instagram.com/asaiasa_asia" target="_blank">
                  <FaInstagram
                    className="h-full w-auto hover:text-gray-300"
                    width={50}
                    height={50}
                  />
                </Link>
              </div>
              <div className="h-full w-auto"> 
                {t("email")} :{" "}
                <Link
                  href="mailto:contact@asaiasa.com"
                  className="hover:text-white/90 underline"
                >
                  contact@asaiasa.com
                </Link>
              </div>

              {/* <div className="h-full w-auto">
                <FaYoutube
                  className="h-full w-auto hover:text-gray-300"
                  width={50}
                  height={50}
                />
              </div> */}
            </div>
          </div>
          {/* <div className="text-white font-normal text-base w-full">
            {t("email")} :{" "}
            <Link
              href="mailto:contact@asaiasa.com"
              className="hover:text-white/90 underline"
            >
              contact@asaiasa.com
            </Link>
          </div> */}
          {/* <div className="text-white font-normal text-base w-full">
            {t("phone")} :{" "}
            <Link
              href="tel:+66876428591"
              className="hover:text-white/90 underline"
            >
              +66876428591
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}
