import { UserRole } from "@prisma/client";

/**
 * Extracts the error message from an error object.
 * If the error is not an instance of the Error class, a default message is returned.
 */
export function extractErrorMessage({ error, defaultMessage }: { error: unknown, defaultMessage: string }): string {
    // Check if the provided error is an instance of the Error class
    if (error instanceof Error) {
        // Return the error message
        return error.message;
    }

    // If not an Error instance, return the default message
    return defaultMessage;
}


// Converts the last segment of a URL into an uppercase string representing a user role.
export function urlToUserRole(url: string) {
    const role = url.split("/").pop();
    const uppercaseRole = role?.toUpperCase();
    return uppercaseRole;
}

// Converts a user role (string or UserRole enum) to a lowercase string.
export function UserRoleToLowerCaseString(role: string | UserRole) {
    return role.toLowerCase();
}

// Calculates an expiration timestamp by adding a given number of minutes to the current time.
export function expiryInMinutes(minutes: number) {
    return new Date(Date.now() + minutes * 60 * 1000);
}