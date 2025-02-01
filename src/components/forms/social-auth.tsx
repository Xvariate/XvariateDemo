"use client";
import { oAuthAction } from "@/actions/auth-actions/oauth-action";
import { FcGoogle } from "react-icons/fc";

interface SocialAuthProps {
  isPending: boolean;
  userRole: string;
}

// * SocialAuth component: Provides a button for social authentication (currently only with Google)
// * Part of the FormWrapper
export const SocialAuth = ({ isPending, userRole }: SocialAuthProps) => {
  
  const onClick = async (provider: "google") => {
    const res = await oAuthAction({ provider, userRole });
    console.log(res);
  };

  return (
    <button
      className="flex min-h-12 w-full items-center justify-center gap-x-3 rounded-md border bg-transparent px-8 py-3 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isPending}
      onClick={() => onClick("google")}
    >
      <FcGoogle className="h-6 w-6" />
      <p className="text-base">Continue with Google</p>
    </button>
  );
};
