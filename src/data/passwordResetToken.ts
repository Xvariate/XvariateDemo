import prisma from "@/prisma";
import { extractErrorMessage } from "../lib/helpers";

export async function getPasswordResetTokenByEmail(email: string) {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email }
        });

        return passwordResetToken;
    } catch (error) {
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch verification token."
        })
        throw new Error(message);
    }
}


export async function getPasswordResetTokenByToken(token: string) {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        })

        return passwordResetToken;
    } catch (error) {
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch verification token."
        })
        throw new Error(message);
    }
}