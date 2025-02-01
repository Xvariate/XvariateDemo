"use client";
import { useState, useTransition } from "react";
import * as z from "zod";
import { IconLoader2, IconLogin2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormWrapper } from "./form-wrapper";
import { FormErrorMessage } from "./form-tools/form-errror-message";
import { FormSuccessMessage } from "./form-tools/form-success-message";
import { ShowHidePassword } from "./form-tools/show-hide-password";
import { useSearchParams } from "next/navigation";
import { newPasswordAction } from "@/actions/auth-actions/new-password-action";
import Link from "next/link";

export const NewPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const [isError, setIsError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [useRedirect, setUseRedirect] = useState<string | undefined>("");
  const searchParam = useSearchParams();
  const token = searchParam.get("token");

  //* Initialize the form with validation and default values
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "", // Default value for the email field
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setIsSuccess("");
    setIsError("");

    startTransition(async () => {
      const data = await newPasswordAction(values, token as string);

      if (data.error) {
        //form.reset();
        console.log(data.error);
        setIsError(data.error);
        //console.log(isError);
      }

      if (data.success) {
        form.reset();
        setIsSuccess(data.success);
        setUseRedirect(data.redirect);
      }
    });
  };

  return (
    <FormWrapper
      showSocialAuth={false} // Display social authentication options
      headerHeading={useRedirect ? "" : "New Password"} // Heading of the form
      headerDescription={useRedirect ? "" : "Create a new password"} // Description below the heading
      action="reset"
      showDivider={false}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3">
            {!useRedirect && (
              <>
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm Password"
                            {...field}
                            type={showConfirmPassword ? "text" : "password"} //* Toggles between text and password
                            className="h-12"
                            disabled={isPending}
                          />

                          {/* Eye icons for showing or hiding password */}
                          <ShowHidePassword
                            showPassword={showConfirmPassword}
                            setShowPassword={setShowConfirmPassword}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormSuccessMessage message={isSuccess} />
          <FormErrorMessage message={isError} />

          <Button
            type="submit"
            className={`w-full ${useRedirect && "animate-pulse"}`}
            size="xl"
            disabled={isPending}
          >
            {renderFormBtn({ showRedirect: useRedirect, isPending })}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};

function renderFormBtn({
  showRedirect,
  isPending,
}: {
  showRedirect: string | undefined;
  isPending: boolean;
}) {
  if (showRedirect) {
    return (
      <Link
        href={showRedirect}
        className="flex items-center justify-center space-x-2"
      >
        <IconLogin2 />
        <span>Go to Login</span>
      </Link>
    );
  } else {
    if (isPending) {
      return (
        <>
          <IconLoader2 className="animate-spin" />
          <span>Changing...</span>
        </>
      );
    } else {
      return "Change Password";
    }
  }
}
