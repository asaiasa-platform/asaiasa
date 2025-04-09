export default function AuthPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        className="bg-cover bg-center bg-no-repeat min-h-screen w-screen overflow-hidden"
        style={{ backgroundImage: "url('/login-bg.svg')" }}
      >
        {children}
      </div>
    </>
  );
}
