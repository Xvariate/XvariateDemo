'use server';
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-tokens";
import prisma from "@/prisma";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export async function newVerificationAction(token: string) {
    // Look up the verification token using the provided value
    const verificationToken = await getVerificationTokenByToken(token);
    if (!verificationToken) {
        return { error: "Invalid verification token." };
    }

    // Make sure the token hasn't expired
    const isExpired = new Date(verificationToken.expires) < new Date();
    if (isExpired) {
        return { error: "This verification token has expired." };
    }

    // Ensure there's an existing user for the email associated with the token
    const existingUser = await getUserByEmail(verificationToken.email);
    if (!existingUser) {
        return { error: "No user is associated with this verification token." };
    }

    // Mark the user's email as verified
    await prisma.user.update({
        where: { email: verificationToken.email },
        data: { emailVerified: new Date() },
    })

    // Remove the used verification token from the database
    await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
    })

    // Verify that a passwordless secret is set
    const credentialProvderSecret = process.env.CREDENTIAL_PROVIDER_SECRET;
    const serverSecret = process.env.SERVER_SECRET;
    if (!credentialProvderSecret) {
        return { error: "Passwordless secret is missing." };
    }

    if (!serverSecret) {
        return { error: "Server secret is missing." };
    }

    const redirectPath = DEFAULT_LOGIN_REDIRECT(existingUser.role);

    // Attempt a passwordless sign-in
    try {
        await signIn("credentials", {
            email: existingUser.email,
            credentialProvderSecret,
            serverSecret,
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                image: existingUser.image,
                emailVerified: existingUser.emailVerified,
                isTwoFactorEnabled: existingUser.isTwoFactorEnabled
            },
            redirectTo: redirectPath,
        })

        return { success: "Email verified successfully!" }
    } catch (error) {
        // Handle sign-in errors
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin": return { error: "Invalid credentials!" };
                default: return { error: "Something went wrong!" };
            }
        }

        throw error;
    }
}