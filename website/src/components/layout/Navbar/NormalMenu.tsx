import { Link } from "@/i18n/routing";
import React from "react";

interface NormalMenuProps {
  readonly label: string;
  readonly href: string;
}

export default function NormalMenu({ label, href }: NormalMenuProps) {
  return (
    <Link href={href} className="flex items-center text-gray-800 hover:text-orange-dark py-2">
      {label}
    </Link>
  );
}
