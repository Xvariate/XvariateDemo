import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";
import { LogInServerSchema, NewVerificationLoginSchema } from "./schemas";

export default {
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