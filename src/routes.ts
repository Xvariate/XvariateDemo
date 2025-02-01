import { UserRole } from "@prisma/client";

// Array of routes that is accessible to public. This routes do not need authentication
export const HOME_ROUTE: string = "/";
export const publicRoutes: string[] = [
    "/",
    "/new-verification",
    "/services",
    "/contact",
    "/about",
    "/privacy",
    "/pricing",
]

const staticAuthRoutes: string[] = [
    "/error",
    "/reset",
    "/new-password",
    "/login",
    "/signup",
];

// Dynamically generate signup routes based on UserRole enum
const dynamicSignupRoutes: string[] = Object.values(UserRole).map(
    (role) => `/signup/${role.toLowerCase()}`
);

// Dynamically generate login routes based on UserRole enum
const dynamicLoginRoutes: string[] = Object.values(UserRole).map((role) => `/login/${role.toLowerCase()}`);

// Combine static and dynamically generated routes into a single array of authentication-related routes
export const authRoutes: string[] = [...staticAuthRoutes, ...dynamicSignupRoutes, ...dynamicLoginRoutes];

// Prefix used for API authentication-related routes
export const apiAuthPrefix: string = "/api/auth"

// Determines the default redirect path after login based on the user's role
export const DEFAULT_LOGIN_REDIRECT = (role: UserRole): string => {
    if (role === UserRole.XVARIATE) {
        return "/xvariate";
    } else if (role === UserRole.FREELANCER) {
        return "/freelancer";
    } else if (role === UserRole.AMBASSADOR) {
        return "/ambassador";
    } else {
        return "/client";
    }
}
