import { ResetForm } from "@/components/forms/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset",
  description: "Reset your password",
};

export default async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ role: string }>;
}) {
  const role = (await searchParams)?.role;
  return <ResetForm role={role} />;
}
