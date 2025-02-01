"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  IconLoader2,
  IconExclamationCircle,
  IconCircleCheck,
  IconMailCheck,
} from "@tabler/icons-react";
import { newVerificationAction } from "@/actions/auth-actions/new-verification-action";
import { resetVerificationToken } from "@/actions/auth-actions/reset-vericationtoken-action";

/**
 * A component for verifying a new user's email token and handling
 * various UI states (success, error, pending, token reset).
 */
export default function NewVerificationComponent() {
  // Tracks the success, error, and token reset states, as well as loading transitions
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const [isError, setIsError] = useState<string | undefined>("");
  const [isTokenReset, setIsTokenReset] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // Extracts the verification token from the URL
  const searchParam = useSearchParams();
  const token = searchParam.get("token");

  /**
   * Verifies the email by calling the server action and
   * handles the success or error state accordingly.
   */
  const verifyEmail = useCallback(async () => {
    // Reset any existing messages to keep the feedback clear
    setIsError("");
    setIsSuccess("");
    setIsTokenReset("");

    // If no token is found, display an error immediately
    if (!token) {
      setIsError("Verification token is missing.");
      return;
    }

    // Calls the server action to verify the token
    const data = await newVerificationAction(token);

    // If the backend returns an error, set it in state
    if (data?.error) {
      setIsError(data.error);
    }

    // On success, set success message.
    if (data?.success) {
      setIsSuccess(data.success);
    }
  }, [token]);

  // Trigger the email verification when the component is mounted.
  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  /**
   * Resends a verification email by requesting a new token
   * and updates the state based on the response.
   */
  const resendVerificationEmail = async () => {
    setIsError("");
    setIsSuccess("");
    startTransition(async () => {
      // Call the server action to reset the verification token.
      const data = await resetVerificationToken(token as string);
      if (data?.error) {
        setIsError(data.error);
      }

      if (data?.success) {
        setIsTokenReset(data?.success);
      }
    });
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-xl flex-col items-center justify-center gap-y-10 text-center">
      {/* Icon feedback for error, success, token reset, or pending states */}
      <div>
        {isError && (
          <IconExclamationCircle className="h-28 w-28 text-destructive" />
        )}

        {isSuccess && (
          <IconCircleCheck className="h-28 w-28 text-emerald-500" />
        )}

        {((!isError && !isSuccess && !isTokenReset) || isPending) && (
          <IconLoader2 className="h-28 w-28 animate-spin" />
        )}

        {isTokenReset && (
          <IconMailCheck className="h-28 w-28 text-emerald-500" />
        )}
      </div>

      {/* Display messages for each state: error, success, pending, or token reset */}
      <div>
        {isError && (
          <div className="">
            <h3 className="mb-3 font-semibold">{isError}</h3>
            {isError !== "Invalid verification token." && (
              <div className="flex items-center justify-center gap-x-2">
                No worries!
                <p
                  className="cursor-pointer text-blue-500 underline"
                  onClick={resendVerificationEmail}
                >
                  Resend verification email
                </p>
              </div>
            )}
          </div>
        )}

        {isSuccess && (
          <div className="">
            <h3 className="mb-3 font-semibold">{isSuccess}</h3>
            {/* <p>You&apos;re all set! Your email is verified.</p>   */}
            <div className="flex items-center justify-center gap-x-3">
              <IconLoader2 className="h-6 w-6 animate-spin" />
              <p className="animate-pulse">Taking you to your dashboard...</p>
            </div>
          </div>
        )}

        {isPending && (
          <div>
            <h3 className="mb-3 animate-pulse font-semibold">
              Sending verification email
            </h3>
            <p className="text-gray-500">
              Please wait while we send the verification email
            </p>
          </div>
        )}

        {isTokenReset && (
          <div>
            <h3 className="mb-3 font-semibold">{isTokenReset}</h3>
            <p className="text-gray-500">
              Please check your inbox for a verification link.
            </p>
          </div>
        )}

        {!isError && !isSuccess && !isPending && !isTokenReset && (
          <div>
            <h2 className="mb-3 animate-pulse">Verifying your email</h2>
            <p className="text-gray-500">
              Please wait while we verify your email
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
