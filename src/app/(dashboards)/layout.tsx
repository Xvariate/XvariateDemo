import LogoutWrapper from "@/components/forms/form-tools/logout-wrapper";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen pt-20">
        {children}
        <div className="mt-10 text-center border border-border p-3 w-fit mx-auto rounded-md">
          <LogoutWrapper>Log Out</LogoutWrapper>
        </div>
      </main>
    </>
  );
}
