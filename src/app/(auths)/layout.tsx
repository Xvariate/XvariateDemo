import AuthHeader from "@/components/navbar/auth-header/auth-header";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <AuthHeader />
      </header>
      <main className="min-h-screen px-6 font-geist-sans">
        <div className="flex min-h-screen w-full items-center justify-center minxl:justify-around">
          <div className="flex w-full items-center justify-center md:max-w-lg minxl:w-1/2">
            {children}
          </div>
          <div className="hidden items-center justify-center minxl:flex minxl:w-1/2">
            <div className="w-[24rem]">
              <Image
                src={`/images/svg/transparent/logos/lightmode-xv-logo-transparent.svg`}
                alt="xvariate logo"
                className="block dark:hidden"
                width={1000}
                height={1000}
              />
              <Image
                src={`/images/svg/transparent/logos/darkmode-xv-logo-transparent.svg`}
                alt="xvariate logo"
                className="hidden dark:block"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
