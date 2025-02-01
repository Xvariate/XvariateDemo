'use server'
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { upsertVerificationToken } from "@/lib/upsert-tokens";

export const resetVerificationToken = async (token: string) => {
    // Retrieve the old token details using the provided token
    const oldToken = await getVerificationTokenByToken(token);

    // Generate a new verification token using the email from the old token
    const newToken = await upsertVerificationToken(oldToken?.email as string);

    // Fetch the user associated with the new token's email
    const user = await getUserByEmail(newToken.email);

    // If no user is found, return an error response
    if (!user) {
        return { error: "No user is associated with this verification token." };
    }

    // Send the new verification email to the user
    await sendVerificationEmail(newToken.email, newToken.token, user.name as string);

    // Return a success response
    return { success: "Verification token has been sent." };
}