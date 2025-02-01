"use client";
import { useState, useTransition } from "react";
import * as z from "zod";
import { IconLoader2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
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
import { ServerActionReturn } from "@/typescript-types/server-types";
import { resetAction } from "@/actions/auth-actions/reset-action";
interface ResetFormProps {
  role: string;
}

export const ResetForm = ({ role }: ResetFormProps) => {
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const [isError, setIsError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  //* Initialize the form with validation and default values
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "", // Default value for the email field
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    setIsSuccess("");
    setIsError("");

    startTransition(async () => {
      const data: ServerActionReturn = await resetAction(values);

      if (data.error) {
        //form.reset();
        console.log(data.error);
        setIsError(data.error);
        //console.log(isError);
      }

      if (data.success) {
        form.reset();
        setIsSuccess(data.success);
      }
    });
  };

  return (
    <FormWrapper
      showSocialAuth={false} // Display social authentication options
      headerHeading="Reset Password" // Heading of the form
      headerDescription="Enter your email to get a reset link" // Description below the heading
      backButtonHref={`/login/${role}`} // Link to navigate back to login
      backButtonLabel="Back to login" // Text for the back button
      isPending={isPending} // Form pending state
      action="reset"
      showDivider={false}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3">
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
                      disabled={isPending || !!isSuccess}
                    />
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
            disabled={isPending || !!isSuccess}
          >
            {isPending && <IconLoader2 className="h-20 w-20 animate-spin" />}
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};
