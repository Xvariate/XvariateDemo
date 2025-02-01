'server only';  // Ensure this file runs on the server side for security
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Retrieves the current session and returns the user details if available.
 * 
 * @returns The user object from the session, or undefined if no session exists.
 */
export const getSession = async () => {
    const session = await auth();
    return session?.user;
}


/**
 * Verifies the current session and checks if the user is authenticated.
 * 
 * If the user is not authenticated (no valid session), it redirects them to the "/signin" page.
 * 
 * @returns An object containing the authenticated user's ID if valid.
 */
export const verifySession = async () => {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user?.id) {
            redirect("/login");
        }

        return user;
    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Unauthorized");
    }
};
