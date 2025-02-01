import { UserRole } from "@prisma/client"
import { type DefaultSession } from "next-auth"

// Extend the default NextAuth user object to include additional properties
export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;  // User's role (e.g., Admin, User, etc.)
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
}

// Extend the default NextAuth module to include the extended user in the session object
declare module "next-auth" {
    interface Session {
        user: ExtendedUser // Use the extended user type in the session
    }
}