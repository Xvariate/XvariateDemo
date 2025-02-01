'use server';
import { getUserByEmail } from "@/data/user";
import { SignUpSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { extractErrorMessage } from "@/lib/helpers";
import prisma from "@/prisma";
import { UserRole } from "@prisma/client";
import { sendVerificationEmail } from "@/lib/mail";
import { upsertVerificationToken } from "@/lib/upsert-tokens";


export const signupAction = async (values: z.infer<typeof SignUpSchema>) => {
    const validatedFields = SignUpSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Validation failed. Please check your input." };
    }

    const { name, email, password, userRole } = validatedFields.data
    // Extract First name 
    const firstName = name.split(" ")[0]

    if (!Object.values(UserRole).includes(userRole as UserRole)) {
        return { error: "Invalid user role" };
    }

    try {
        const user = await getUserByEmail(email);
        if (user) {
            console.error(`Duplicate user attempt for email: ${email}`);
            return { error: "Please try again or log in if you already have an account." }; // Generic error message
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        console.log("Creating user with data:", {
            name,
            email,
            password: hashedPassword,
            role: userRole,
        });

        // Create the user in the database
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: userRole as UserRole,
            }
        })

        const verificationToken = await upsertVerificationToken(email);
        await sendVerificationEmail(email, verificationToken.token, firstName);
        return { success: "Please check your email to verify your account." };

    } catch (error) {
        console.error("signupAction Error:", error);
        const message = extractErrorMessage({ error, defaultMessage: "Unable to process your request. Please try again." }); // Generic error message
        return { error: message };
    }
}