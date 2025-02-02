import { LoginForm } from "@/components/forms/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Welcome back",
};

export default async function Login({
  params,
}: {
  params: Promise<{ role?: string }>;
}) {
  const role = (await params)?.role;
  return <LoginForm role={role as string} />;
}
