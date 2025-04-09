import NavigationBar from "@/components/layout/Navbar/NavBar";

export default function NavbarPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
