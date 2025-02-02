import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { CredentialProviderSchema } from "@/schemas";


export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            // Handle custom authentication with credentials
            async authorize(credentials) {
                const validatedFields = CredentialProviderSchema.safeParse(credentials);
                if (validatedFields.success) {
                    const secretFromEnv = process.env.CREDENTIAL_PROVIDER_SECRET;
                    // Validate the passwordless secret
                    if (!secretFromEnv) {
                        return null; // Return null if CREDENTIAL_PROVIDER_SECRET is missing in the environment
                    }

                    const { user, credentialProvderSecret } = validatedFields.data;
                    if (credentialProvderSecret === secretFromEnv) {
                        const userFromLoginAction = user;
                        return userFromLoginAction; // Return the user if valid
                    }
                }
                return null; // Return null if validation fails
            }
        })
    ],
} as NextAuthConfig