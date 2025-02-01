import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";
import { LogInServerSchema, NewVerificationLoginSchema } from "./schemas";
import { getUserById } from "./data/user";
import { getAccountByUserId } from "./data/account";
import { UserRole } from "@prisma/client";

export default {
    callbacks: {
        // Handle sign-in logic, ensuring credentials match the server secret
        async signIn({ account, credentials }) {
            if (account?.provider !== 'credentials') return true  // Allow OAuth sign-ins
            const envServerSecret = process.env.SERVER_SECRET;
            if (envServerSecret !== credentials?.serverSecret) return false;  // Reject if secrets don't match
            return true; // Allow sign-in if valid
        },
        async jwt({ token }) {
            // If the token does not have a sub (user ID), return the token as is.
            // This happens during the first sign-in attempt when the token is still in its initial state.
            if (!token.sub) return token;

            // Query the user based on the token's sub (user ID)
            const existingUser = await getUserById(token.sub);

            // If the user does not exist, return an empty object to force logout
            if (!existingUser) return {}; // Security-Focused Approach!

            // Query the user's account details (e.g., OAuth account)
            const existingAccount = await getAccountByUserId(existingUser.id);

            // Add user information to the token
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            token.isOAuth = !!existingAccount;  // Check if the user has an OAuth account
            return token;
        },
        async session({ session, token }) {
            // The session callback depends on the jwt callback and runs after it.
            // It enriches the session object with additional user information from the token.
            if (session.user) {
                if (token.sub) session.user.id = token.sub;
                if (token.name) session.user.name = token.name;
                if (token.email) session.user.email = token.email;
                if (token.role) session.user.role = token.role as UserRole;
                if (token.isTwoFactorEnabled) session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
                if (token.isOAuth) session.user.isOAuth = token.isOAuth as boolean;
            }
            // Return the enriched session object
            return session;
        },
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            // Handle custom authentication with credentials
            async authorize(credentials) {
                if (credentials.newVerificationSecret) {
                    const validateNewVerificationFields = NewVerificationLoginSchema.safeParse(credentials);
                    if (validateNewVerificationFields.success) {
                        const envNewVerificationSecret = process.env.NEW_VERIFICATION_SECRET;
                        // Validate the passwordless secret
                        if (!envNewVerificationSecret) {
                            return null; // Return null if passwordless secret is missing
                        }

                        const { email, newVerificationSecret } = validateNewVerificationFields.data;
                        if (newVerificationSecret === envNewVerificationSecret) {
                            const user = await getUserByEmail(email);
                            if (!user || !user.password) return null;
                            return user; // Return the user if valid
                        }
                    }
                }

                // Validate email and password for traditional logins
                const validatedFields = LogInServerSchema.safeParse(credentials);
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) return user; // Return the user if credentials are correct
                }
                return null; // Return null if validation fails
            }
        })
    ]
} as NextAuthConfig