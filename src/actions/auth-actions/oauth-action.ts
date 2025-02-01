"use server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { OAuthActionSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import * as z from "zod";

/**
 * Handles OAuth-based sign-in by validating the user role,
 * storing it in a secure cookie, and redirecting upon successful sign-in.
 */
export const oAuthAction = async (values: z.infer<typeof OAuthActionSchema>) => {
  // Validate the incoming request data using a Zod schema
  const validatedFields = OAuthActionSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Validation failed. Please check your input." };
  }

  // Destructure the validated data
  const { provider, userRole } = validatedFields.data;

  // Destructure the validated data
  if (!Object.values(UserRole).includes(userRole as UserRole)) {
    return { error: "Invalid user role" };
  }

  // Determine the redirect path based on the user role
  const redirectPath = DEFAULT_LOGIN_REDIRECT(userRole as UserRole);

  // Determine if the environment is production for setting secure cookies
  const isProd = process.env.NODE_ENV === "production";

  // Retrieve the cookie store and store the user role in a cookie
  // This cookie indicates the intended role for the OAuth flow
  const cookieStore = await cookies();  // <<-- If 'cookies()' returns a Promise

  cookieStore.set("pending_oauth_role", userRole, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 300, // 5 minutes to complete the flow
  });

  // Initiate OAuth sign-in with the specified provider, then redirect
  try {
    await signIn(provider, {
      redirectTo: redirectPath,
    });
  } catch (error) {
    //console.error("Error during OAuth sign-in:", error);
    throw error;
  }
}