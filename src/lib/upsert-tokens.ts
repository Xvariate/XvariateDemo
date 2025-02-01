import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import prisma from "@/prisma";
import { expiryInMinutes, extractErrorMessage } from "./helpers";

// Creates or updates a password reset token for the given email
export const upsertPasswordResetToken = async (email: string) => {
    const token = uuidv4();  // Generate a unique token
    const expires = expiryInMinutes(5) // Set expiration time to 5 minutes

    try {
        // Create or update the password reset token in the database
        const passwordResetToken = await prisma.passwordResetToken.upsert({
            where: { email },
            create: {
                email,
                token,
                expires,
            },
            update: {
                token,
                expires,
            },
        });

        return passwordResetToken; // Return the updated or newly created token
    } catch (error) {
        // Extract and throw a user-friendly error message
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch password reset token."
        })
        throw new Error(message);
    }
}


// Creates or updates a verification token for the given email
export const upsertVerificationToken = async (email: string) => {
    const token = uuidv4(); // Generate a unique token
    const expires = expiryInMinutes(5) // Set expiration time to 5 minutes

    try {
        // Create or update the verification token in the database
        const verificationToken = await prisma.verificationToken.upsert({
            where: { email },
            create: {
                email,
                token,
                expires,
            },
            update: {
                token,
                expires,
            },
        });

        return verificationToken; // Return the updated or newly created token
    } catch (error) {
        // Extract and throw a user-friendly error message
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch verification token."
        })
        throw new Error(message);
    }
}


// Creates or updates a two-factor authentication OTP for the given email
export const upsertTwoFactorOTP = async (email: string) => {
    const otp = crypto.randomInt(100_000, 1_000_000).toString();  // Generate a random 6-digit OTP
    const expires = expiryInMinutes(5) // Set expiration time to 5 minutes

    try {
        // Create or update the two-factor authentication OTP in the database
        const twoFactorOTP = await prisma.twoFactorOTP.upsert({
            where: { email },
            create: {
                email,
                otp,
                expires,
            },
            update: {
                otp,
                expires,
            },
        })
    
        return twoFactorOTP; // Return the updated or newly created OTP
    } catch (error) {
        // Extract and throw a user-friendly error message
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch two-factor authentication OTP."
        })
        throw new Error(message);
    }
}
