import { SignUPForm } from "@/components/forms/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Get started",
};

export default async function SignUp({ params }: { params: Promise<{ role?: string }> }) {
  const role = (await params)?.role;
  return <SignUPForm role={role as string} />;
}
