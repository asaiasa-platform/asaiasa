"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LangSwitcher() {
  const router = useRouter();
  const activeLocale = useLocale();
  const currPathExcludeLocale = usePathname();

  // change locale language but main tain all the existing path
  const onSelectChange = (value: string) => {
    router.push(currPathExcludeLocale, { locale: value });
  };
  return (
    <Select value={activeLocale} onValueChange={onSelectChange}>
      <SelectTrigger className="w-fit h-[40px] border-none bg-transparent">
        <SelectValue defaultValue={activeLocale}>
          <div className="flex gap-2 pr-1">
            <Image
              src={`/icon/${activeLocale}.svg`}
              alt={activeLocale}
              width={20}
              height={20}
            />
            <span className="hidden lg:block">
              {activeLocale === "th" ? "ภาษาไทย" : "English"}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-fit">
        <SelectItem value="th">
          <div className="flex gap-2">
            <Image src="/icon/th.svg" alt="Thai" width={20} height={20} />
            <span>ภาษาไทย</span>
          </div>
        </SelectItem>
        <SelectItem value="en">
          <div className="flex gap-2">
            <Image src="/icon/en.svg" alt="English" width={20} height={20} />
            <span>English</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
