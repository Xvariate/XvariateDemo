import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import authConfig from "./auth.config";


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
    ...authConfig,
})