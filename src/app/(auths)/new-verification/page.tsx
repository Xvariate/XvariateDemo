import NewVerificationComponent from "@/components/pages/new-verification";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "New Verification",
  description: "New user verification page",
};

export default function NewVerification() {
  return <NewVerificationComponent />;
}
