import { FormHeader } from "@/components/forms/form-header";
import { DividerWithText } from "./form-tools/DividerWithText";
import { SocialAuth } from "@/components/forms/social-auth";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FormWrapperProps {
  userRole?: string;
  headerHeading: string;
  headerDescription: string;
  showSocialAuth: boolean;
  children: React.ReactNode;
  className?: string;
  backButtonLabel?: string | boolean;
  backButtonHref?: string | boolean;
  isPending?: boolean;
  action: "login" | "signup" | "reset";
  showDivider?: boolean;
}

export const FormWrapper = ({
  children, // Nested components
  headerHeading, // Main heading
  headerDescription, // Subheading
  showSocialAuth, // Whether to show social authentication
  className, // Additional class names
  backButtonHref, // Back button URL
  backButtonLabel, // Back button text
  userRole, // User role
  isPending,
  action,
  showDivider,
}: FormWrapperProps) => {
  return (
    <div className={cn("w-full minxl:max-w-sm", className)}>
      <FormHeader
        headerHeading={headerHeading}
        headerDescription={headerDescription}
        className="mb-8"
      />

      {/* Social authentication section */}
      {showSocialAuth && (
        <SocialAuth
          isPending={isPending || false}
          userRole={userRole as string}
        />
      )}

      {/* Divider with "or" */}
      {showDivider && <DividerWithText className="my-5">or</DividerWithText>}

      {/* //* Main Sign Up Form passed as children */}
      {children}

      {backButtonHref && (
        <Button
          variant={`link`}
          size={`sm`}
          className="mt-2 w-full font-normal text-muted-foreground hover:no-underline"
          disabled={isPending}
        >
          {backButtonLabel}
          <Link href={backButtonHref as string} className="text-primary underline">
            {action === "login" && "Sign Up"}
            {action === "signup" && "Log In"}
            {action === "reset" && "Log In"}
          </Link>
        </Button>
      )}
    </div>
  );
};
