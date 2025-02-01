import { IconWorldCode } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-2 font-geist-sans">
      <h1 className="font-geist-mono text-7xl font-bold md:text-9xl">
        Xvariate
      </h1>
      <div className="mb-5 mt-8 max-w-md bg-white p-6 shadow-sm">
        <h2 className="mb-2 flex animate-pulse items-center gap-x-2 text-xl font-semibold text-gray-900">
          Under Redevelopment
          <span>
            <IconWorldCode className="h-6 w-6" />
          </span>
        </h2>
        <p className="text-gray-600">
          Our portfolio web application is undergoing a complete redevelopment
          to improve functionality and user experience. We&apos;ll be back
          online within two weeks. Thank you for your understanding!
        </p>
      </div>
      <p>www.xvariate.com</p>
    </div>
  );
}
