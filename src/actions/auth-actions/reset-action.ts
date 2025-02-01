'use server';
import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { upsertPasswordResetToken } from "@/lib/upsert-tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

// Handles the password reset request by validating input, generating a reset token, and sending a reset email
export const resetAction = async (values: z.infer<typeof ResetSchema>) => {
    // Validate the input fields using the ResetSchema
    const validatedFields = ResetSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Validation failed. Please check your input." }
    }

    const { email } = validatedFields.data;

    // Check if a user exists with the provided email
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email) {
        return { error: "User not found" };
    }

    // Extract the first name of the user (used for personalizing the email)
    const firstName = existingUser.name?.split(" ")[0];

    // Create or update a password reset token for the user
    const passwordResetToken = await upsertPasswordResetToken(email);
    
    // Send a password reset email with the generated token
    await sendPasswordResetEmail(email, passwordResetToken.token, firstName as string);

     // Return a success message to inform the user
    return { success: "Check your email for a password reset link." };
}