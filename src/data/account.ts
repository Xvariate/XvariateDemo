import { extractErrorMessage } from "@/lib/helpers";
import prisma from "@/prisma";

export async function getAccountByUserId(userId: string) {
    try {
        const account = await prisma.account.findFirst({
            where: {
                userId,
            },
        })

        return account;
    } catch (error) {
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch account data."
        })
        throw new Error(message);
    }
}