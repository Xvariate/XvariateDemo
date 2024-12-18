import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
//import * as z from "zod";
//import bcrypt from "bcryptjs";

// const SignInSchema = z.object({
//     email: z.string().email({ message: "Email is required" }),
//     password: z.string().min(1, { message: "Password is required" }),
//     code: z.optional(z.string()),
// })

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    callbacks: {

    },
    events: {

    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            // async authorize(credentials) {
            //     const validatedFields = SignInSchema.safeParse(credentials)
            //     if (validatedFields.success) {
            //         const { email, password } = validatedFields.data
            //         const user = await prisma.user.findUnique({
            //             where: {
            //                 email,
            //             }
            //         })

            //         if (!user || !user.password) return null;
            //         const passwordMatch = await bcrypt.compare(password, user.password)
            //         if (passwordMatch) return user;
            //     }
            //     return null;
            // }
        })
    ],
})