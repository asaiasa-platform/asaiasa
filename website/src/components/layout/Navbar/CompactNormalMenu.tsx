import { Link } from "@/i18n/routing";
import React from "react";

interface CompactNormalMenuProps {
  readonly label: string;
  readonly href: string;
  readonly handleOnClick: () => void;
}

export default function CompactNormalMenu({
  label,
  href,
  handleOnClick,
}: CompactNormalMenuProps) {
  return (
    <Link href={href} onClick={handleOnClick}>
      <div
        className="block text-sm text-gray-800 hover:bg-orange-normal hover:text-white 
      transition-all duration-150 px-3 py-3 font-normal"
      >
        {label}
      </div>
    </Link>
  );
}
