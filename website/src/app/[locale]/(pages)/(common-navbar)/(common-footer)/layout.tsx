import BigFooter from "@/components/layout/BigFooter";

export default function FooterPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <BigFooter />
    </>
  );
}
