import prisma from "@/prisma";
import { extractErrorMessage } from "../lib/helpers";

export async function getVerificationTokenByEmail(email: string) {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { email }
        });

        return verificationToken;
    } catch (error) {
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch verification token."
        })
        throw new Error(message);
    }
}


export async function getVerificationTokenByToken(token: string) {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        return verificationToken;
    } catch (error) {
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch verification token."
        })
        throw new Error(message);
    }
}