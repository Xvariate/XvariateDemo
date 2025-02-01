import { v4 as uuidv4 } from "uuid";
import prisma from "@/prisma";
import { getVerificationTokenByEmail } from "../data/verification-tokens";
import crypto from "crypto";
import { getTwoFactorOTPByEmail } from "@/data/twoFactorOtp";
import { getPasswordResetTokenByEmail } from "@/data/passwordResetToken";
import { expiryInMinutes } from "./helpers";


export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = expiryInMinutes(5) // 5 minutes

    const existingVerificationToken = await getVerificationTokenByEmail(email);
    if (existingVerificationToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingVerificationToken.id
            }
        })
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return verificationToken;
}


export const generateTwoFactorOTP = async (email: string) => {
    const otp = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = expiryInMinutes(5) // 5 minutes

    const existingTwoFactorOTP = await getTwoFactorOTPByEmail(email);;
    if (existingTwoFactorOTP) {
        await prisma.twoFactorOTP.delete({
            where: {
                id: existingTwoFactorOTP.id
            }
        })
    }

    const twoFactorOTP = await prisma.twoFactorOTP.create({
        data: {
            email,
            otp,
            expires,
        }
    })

    return twoFactorOTP;
}



export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = expiryInMinutes(5) // 5 minutes

    const existingPasswordResetToken = await getPasswordResetTokenByEmail(email);
    if (existingPasswordResetToken) {
        await prisma.passwordResetToken.delete({
            where: {
                id: existingPasswordResetToken.id
            }
        })
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return passwordResetToken;
}