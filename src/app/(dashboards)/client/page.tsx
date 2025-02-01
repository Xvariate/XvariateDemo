//import Image from "next/image";
import { currentUser } from "@/lib/serverSession";

export default async function Dashboard() {
  const user = await currentUser();
  return (
    <div className="flex flex-col items-center justify-center font-geist-sans">
      <h1 className="font-geist-mono text-5xl font-bold md:text-7xl">
        Welcome
      </h1>
      <p>www.xvariate.com</p>

      <div className="mt-8 flex w-full items-center justify-center">
        {user ? (
          <div className="flex-col items-center justify-center space-y-2">
            <p>Welcome, {user?.name}!</p>
            <p><span className="font-bold">Email:</span> {user?.email}</p>
            <p><span className="font-bold">Role:</span> {user?.role}</p>
            <p><span className="font-bold">2FA:</span> {user?.isTwoFactorEnabled ? "On" : "Off"}</p>
            <p><span className="font-bold">OAuth Account:</span> {user?.isOAuth ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p>Please sign in</p>
        )}
      </div>
    </div>
  );
}
