import "../[locale]/globals.css";
import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="font-prompt">
      <body>{children}</body>
    </html>
  );
}