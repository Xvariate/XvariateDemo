'use server';
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorOTPEmail, sendVerificationEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LogInSchema } from "@/schemas";
//import { loginActionReturn } from "@/typescript-types/server-types";
import { AuthError } from "next-auth";
import * as z from "zod";
import { getTwoFactorOTPByEmail } from "@/data/twoFactorOtp";
import prisma from "@/prisma";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";
import bcrypt from "bcryptjs"
import { upsertTwoFactorOTP, upsertVerificationToken } from "@/lib/upsert-tokens";
import { UserRole } from "@prisma/client";


export const loginAction = async (values: z.infer<typeof LogInSchema>, userRole?: string) => {
    const validatedFields = LogInSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Validation failed. Please check your input." };
    }

    if (!Object.values(UserRole).includes(userRole as UserRole)) {
        return { error: "Invalid user role" };
    }

    const { email, password, otp } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "User not found" };
    }

    if (!existingUser.password) {
        return { error: "Please choose 'Continue with Google' to log in." };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await upsertVerificationToken(existingUser.email as string);
        await sendVerificationEmail(verificationToken.email, verificationToken.token, existingUser.name as string);
        return { success: "Verify your email. Please check your inbox for a verification link." };
    }

    const credentialProvderSecret = process.env.CREDENTIAL_PROVIDER_SECRET;
    const serverSecret = process.env.SERVER_SECRET;

    if (!credentialProvderSecret) {
        return { error: "Passwordless secret is missing." };
    }

    if (!serverSecret) {
        return { error: "Server secret is missing." };
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
        return { error: "Invalid password" };
    }

    // Determine the redirect path based on the user role
    const redirectPath = DEFAULT_LOGIN_REDIRECT(existingUser.role);

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (otp) {
            const verificationOtp = await getTwoFactorOTPByEmail(existingUser.email);
            if (!verificationOtp) return { error: "Invalid OTP" }
            if (verificationOtp?.otp !== otp) return { error: "Invalid OTP" };
            const hasExpired = new Date(verificationOtp.expires) < new Date();
            if (hasExpired) {
                return { error: "Code has expired!" };
            }
            await prisma.twoFactorOTP.delete({
                where: {
                    id: verificationOtp.id
                }
            });

            // create two factor confirmation for record
            const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingTwoFactorConfirmation) {
                await prisma.twoFactorConfirmation.delete({
                    where: { id: existingTwoFactorConfirmation.id }
                })
            }

            await prisma.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
        } else {
            const twoFactorOTP = await upsertTwoFactorOTP(existingUser.email);
            await sendTwoFactorOTPEmail(existingUser.email, twoFactorOTP.otp);
            return { twoFactor: "Please check your email for the OTP." };
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            serverSecret,
            credentialProvderSecret,
            user: JSON.stringify({
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                image: existingUser.image,
                emailVerified: existingUser.emailVerified,
                isTwoFactorEnabled: existingUser.isTwoFactorEnabled,
            }),
            redirectTo: redirectPath,
        });

        return { success: "Successfully signed in!" };
    } catch (error: unknown) {
        if (error instanceof AuthError) {
            console.log("Error type ---> ", error);
            switch (error.type) {
                case "CredentialsSignin": return { error: "Invalid credentials!" };
                default: return { error: "Something went wrong!" };
            }
        }

        throw error;
    }
}