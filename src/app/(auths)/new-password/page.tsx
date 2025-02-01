import { NewPasswordForm } from "@/components/forms/new-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Password",
  description: "Create new password",
};

export default async function NewPassword() {
  return <NewPasswordForm />;
}
