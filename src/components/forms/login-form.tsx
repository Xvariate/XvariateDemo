"use client";
import { useState, useTransition } from "react";
import * as z from "zod";
import { IconLoader2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormWrapper } from "./form-wrapper";
import { FormErrorMessage } from "./form-tools/form-errror-message";
import { FormSuccessMessage } from "./form-tools/form-success-message";
import { loginActionReturn } from "@/typescript-types/server-types";
import { loginAction } from "@/actions/auth-actions/login-action";
import { urlToUserRole } from "@/lib/helpers";
import { FormInfoMessage } from "./form-tools/form-info-message";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShowHidePassword } from "./form-tools/show-hide-password";

export const LoginForm = ({ role }: { role: string }) => {
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const [isError, setIsError] = useState<string | undefined>("");
  const [isInfo, setIsInfo] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isTwoFactor, setIsTwoFactor] = useState<boolean>(false);
  const userRole = urlToUserRole(role);
  const { update } = useSession();

  //* Initialize the form with validation and default values
  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "", // Default value for the email field
      password: "", // Default value for the password field
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof LogInSchema>) => {
    setIsSuccess("");
    setIsError("");
    setIsInfo("");

    if (isTwoFactor) {
      if (!form.getValues().otp) {
        setIsError("Please enter the Two-factor code");
        return;
      }
    }

    startTransition(async () => {
      const data: loginActionReturn = await loginAction(values, userRole);

      if (data.error) {
        //form.reset();
        console.log(data.error);
        setIsError(data.error);
        //console.log(isError);
      }

      if (data.success) {
        form.reset();
        update();
        setIsSuccess(data.success);
      }

      if (data.twoFactor) {
        setIsTwoFactor(true);
        setIsInfo(data.twoFactor);
      }
    });
  };

  return (
    <FormWrapper
      userRole={userRole}
      showSocialAuth={!isTwoFactor} // Display social authentication options
      headerHeading={
        !isTwoFactor ? "Welcome back" : "Two-Factor Authentication"
      } // Heading of the form
      headerDescription={
        !isTwoFactor
          ? "Log in to your account"
          : "Two-factor authentication is enabled"
      } // Description below the heading
      backButtonHref={!isTwoFactor && `/signup/${role}`} // Link to navigate back to login
      backButtonLabel="Don't have an account?" // Text for the back button
      isPending={isPending} // Form pending state
      action="login"
      showDivider={!isTwoFactor}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3">
            {isTwoFactor && (
              <>
                <FormInfoMessage message={isInfo} />
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    console.log(field),
                    (
                      <FormItem>
                        <FormLabel>Enter Verification code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="123456"
                            type="number"
                            disabled={isPending}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  )}
                />
              </>
            )}

            {!isTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          type="email"
                          className="h-12"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Password"
                            {...field}
                            type={showPassword ? "text" : "password"} //* Toggles between text and password
                            className="h-12"
                            disabled={isPending}
                          />

                          {/* Eye icons for showing or hiding password */}
                          <ShowHidePassword
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="ml-auto flex w-fit justify-end px-0 font-normal"
                  size={`sm`}
                  variant="link"
                  type="button"
                  asChild
                  disabled={true}
                >
                  <Link
                    href={{
                      pathname: isPending ? `#` : `/reset`,
                      query: {
                        role: role,
                      },
                    }}
                    className={`${isPending && "cursor-not-allowed opacity-50"}`}
                  >
                    Forgot Password?
                  </Link>
                </Button>
              </>
            )}
          </div>

          <FormSuccessMessage message={isSuccess} />
          <FormErrorMessage message={isError} />

          <Button
            type="submit"
            className="w-full"
            size="xl"
            disabled={isPending}
          >
            {isPending && <IconLoader2 className="h-20 w-20 animate-spin" />}
            {renderFormBtnLabel({ isTwoFactor, isPending })}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};

function renderFormBtnLabel({
  isTwoFactor,
  isPending,
}: {
  isTwoFactor: boolean;
  isPending: boolean;
}) {
  if (isTwoFactor) {
    if (isPending) {
      return "Verifying...";
    } else {
      return "Verify";
    }
  } else {
    if (isPending) {
      return "Logging In...";
    } else {
      return "Log In";
    }
  }
}
