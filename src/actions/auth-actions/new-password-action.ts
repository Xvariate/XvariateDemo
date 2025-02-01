'use server';
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import prisma from "@/prisma";
import { UserRoleToLowerCaseString } from "@/lib/helpers";


// Handles the new password action, validates the token and user input, updates the password, and deletes the token
export const newPasswordAction = async (values: z.infer<typeof NewPasswordSchema>, token?: string) => {
    // Ensure a token is provided
    if (!token) {
        return { error: "Token not found" };
    }

    // Validate the input fields using the schema
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Validation failed. Please check your input." }
    }

    const { password, confirmPassword } = validatedFields.data;

    // Query the password reset token from the database
    const passwordResetToken = await getPasswordResetTokenByToken(token);

    // Check if the token exists and is valid
    if (!passwordResetToken) {
        return { error: "Invalid token" };
    }

    // Verify if the token has expired
    const expired = new Date(passwordResetToken.expires) < new Date();
    if (expired) {
        return { error: "Token has expired" };
    }

    // Ensure the provided passwords match
    if (password !== confirmPassword) {
        return { error: "Passwords do not match. Please type the same password twice." };
    }

    // Query the user associated with the reset token
    const existingUser = await getUserByEmail(passwordResetToken.email);

    // Return an error if the user doesn't exist
    if (!existingUser) {
        return { error: "User not found" };
    }

    // Encrypt the new password
    const encryptedPassword = await bcrypt.hash(password, 10);
    // Determine redirect URL based on user role
    const redirectRole = UserRoleToLowerCaseString(existingUser.role);

    // Update the user's password in the database
    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: encryptedPassword }
    })

    // Delete the used password-reset-token from the database
    await prisma.passwordResetToken.delete({
        where: { id: passwordResetToken.id }
    })

    // Return success message and redirect URL
    return {
        success: "Your password has been successfully updated. Use the button below to proceed to the login page.",
        redirect: `/login/${redirectRole}`
    };
}