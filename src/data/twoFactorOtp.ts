import prisma from "@/prisma";

export async function getTwoFactorOTPByOTP(otp: string) {
    try {
        const twoFactorOTP = await prisma.twoFactorOTP.findUnique({
            where: { otp }
        })

        return twoFactorOTP;
    } catch {
        return null;
    }
}

export async function getTwoFactorOTPByEmail(email: string) {
    try {
        const twoFactorOTP = await prisma.twoFactorOTP.findFirst({
            where: { email }
        })

        return twoFactorOTP;
    } catch {
        return null;
    }
}