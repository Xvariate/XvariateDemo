"use client";
import { useState, useTransition } from "react";
import * as z from "zod";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/schemas";
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
import { signupAction } from "@/actions/auth-actions/signup-action";
import { ServerActionReturn } from "@/typescript-types/server-types";
import { urlToUserRole } from "@/lib/helpers";

interface SignUPFormProps {
  role: string;
}

export const SignUPForm = ({ role }: SignUPFormProps) => {
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const [isError, setIsError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const userRole = urlToUserRole(role);

  //* Initialize the form with validation and default values
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "", // Default value for the name field
      email: "", // Default value for the email field
      password: "", // Default value for the password field
      userRole: userRole, // Default value for the user_role field
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    console.log(values);
    setIsSuccess("");
    setIsError("");

    startTransition(async () => {
      const data: ServerActionReturn = await signupAction(values);

      if (data?.error) {
        setIsError(data.error);
      } else {
        setIsSuccess(data?.success);
      }
    });
  };

  return (
    <FormWrapper
      userRole={userRole} // Role of the user (passed as a prop)
      showSocialAuth={true} // Display social authentication options
      headerHeading="Get started" // Heading of the form
      headerDescription="Create a new account" // Description below the heading
      backButtonHref={`/login/${role}`} // Link to navigate back to login
      backButtonLabel="Already have an account?" // Text for the back button
      isPending={isPending} // Form pending state
      action="signup"
      showDivider
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      type="text"
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
                      <div
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer`}
                      >
                        <IconEye
                          className={`${showPassword ? "hidden" : ""} h-6 w-6 text-muted-foreground`}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                        <IconEyeOff
                          className={`${showPassword ? "" : "hidden"} h-6 w-6 text-muted-foreground`}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};
