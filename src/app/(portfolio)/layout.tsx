//import PortfolioNavbar from "@/components/navbar/portfolio-navbar/portfolio-navbar";

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* // Todo: Finish the Navbar  */}
      {/* <header>
        <PortfolioNavbar />
      </header> */}
      <main className="min-h-screen pt-20">{children}</main>
    </>
  );
}
