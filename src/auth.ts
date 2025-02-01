import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getUserByEmail, getUserById } from "./data/user";
import bcrypt from "bcryptjs"
import { LogInServerSchema, NewVerificationLoginSchema } from "./schemas";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import { getAccountByUserId } from "./data/account";


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma), // Use Prisma as the database adapter
    // Define custom pages for sign-in and error handling
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    // Configure session management to use JSON Web Tokens (JWT)
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        updateAge: 12 * 60 * 60, // 12 hours - Checks every 12 hours to see if the token is still valid
    },
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
    events: {
        async linkAccount({ user }) {
            try {
                // 1. Grab the cookie store (await if needed)
                const cookieStore = await cookies();
                // 2. Get the stored role
                const pendingRole = cookieStore.get("pending_oauth_role")?.value as UserRole | undefined;

                // 3. If we have a role, update the user in DB
                if (pendingRole) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            role: pendingRole,
                            emailVerified: new Date(),
                        },
                    });

                    // 4. Clear the cookie so it doesn't linger
                    cookieStore.set("pending_oauth_role", "", { maxAge: 0 });
                }
            } catch (error) {
                console.error("Error linking account:", error);
            }
        }
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
    ],
})